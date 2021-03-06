import * as AWS from 'aws-sdk';
import * as moment from 'moment-timezone';
import { start } from './jobStarter';
import * as _ from 'lodash';

AWS.config.update({ region: 'us-east-1' });
const cloudwatchevents = new AWS.CloudWatchEvents();

const NY_TIMEZONE = 'America/New_York';
const UTC_TIMEZONE = 'UTC'

/**
 * The cron to trigger this task should be
 *  In March, the second Sunday 03:10 New York time => 07:10 UTC time
 *      cron(10 7 ? MAR 1#2 *)
 * 
 *  In November, the first Sunday 01:10 New York time => 05:10 UTC time
 *      cron(10 5 ? NOV 1#1 *)
 */

const defs = [
    {
        name: 'daily-earnings-calendar',
        description: 'Daily earnings calendar',
        startTimeNY: ['0:30', '13:30'],
        daysOfWeek: 'MON-FRI',
        // AlphaVantage
    },
    {
        name: 'daily-close',
        description: 'Daily close',
        startTimeNY: ['16:30', '20:30', '0:30', '4:30'],
        daysOfWeek: 'MON-SAT',
        // AlphaVantage
    },
    {
        name: 'daily-putcall',
        description: 'Daily putCallRatio',
        startTimeNY: '16:10',
        daysOfWeek: 'MON-FRI',
        // IEX
    },
    {
        name: 'daily-subscription',
        description: 'Daily subscription check',
        startTimeNY: '23:00',
        daysOfWeek: 'MON-FRI',
    },
    {
        name: 'daily-insider',
        description: 'Daily insider transaction',
        startTimeNY: '3:00',
        daysOfWeek: 'MON-FRI',
    },
];

function getDescription(data) {
    const { description, startTimeNY } = data;
    const times = Array.isArray(startTimeNY) ? startTimeNY : [startTimeNY];
    return `${description} at New York time ${times.join(' and ')}`;
}

function getCronInUtcTime(newYorkTimeHHmmArray, daysOfWeek) {
    const array = _.isArray(newYorkTimeHHmmArray) ? newYorkTimeHHmmArray : [newYorkTimeHHmmArray];
    const times = array.map(x => moment.tz(x, 'H:mm', NY_TIMEZONE).tz(UTC_TIMEZONE));
    const minute = times[0].format('m');
    const hours = times.map(t => t.format('H')).join(',');

    return `cron(${minute} ${hours} ? * ${daysOfWeek} *)`;
}

function getRuleParams(data) {
    return {
        Name: data.name,
        Description: getDescription(data),
        ScheduleExpression: getCronInUtcTime(data.startTimeNY, data.daysOfWeek),
        State: 'ENABLED',
        RoleArn: 'arn:aws:iam::115607939215:role/ecsEventsRole',
    };
}

async function updateEventRule(cloudwatchevents, def) {
    const params = getRuleParams(def);
    console.log(def.name, 'params', params);
    return new Promise((res, rej) => {
        cloudwatchevents.putRule(params, (err, data) => {
            if (err) {
                return rej(err);
            }
            res(data);
        });
    })
}

const JOB_NAME = 'adjust-cron';

start(JOB_NAME, async () => {
    for (const def of defs) {
        try {
            await updateEventRule(cloudwatchevents, def)
            console.log(def.name, 'done');
        } catch (e) {
            console.error(def.name, 'error', e);
        }
    }
});

