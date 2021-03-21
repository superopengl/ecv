import { getRepository } from 'typeorm';
import { refreshMaterializedView } from '../src/db';
import { start } from './jobStarter';
import { Stock } from '../src/entity/Stock';
import { syncStockEps } from '../src/services/stockEpsService';
import { executeWithDataEvents } from '../src/services/dataLogService';
import * as sleep from 'sleep-promise';
import errorToJson from 'error-to-json';
import { isUSMarketOpen } from '../src/services/iexService';

const JOB_NAME = 'feed-eps';

const MAX_CALL_TIMES_PER_MINUTE = 50;

start(JOB_NAME, async () => {

  const isMarketOpen = await isUSMarketOpen();
  if (isMarketOpen) {
    console.warn('Market is still open');
    return;
  }

  const sleepTime = 60 * 1000 / MAX_CALL_TIMES_PER_MINUTE;
  const stocks = await getRepository(Stock)
    .find({
      order: {
        symbol: 'ASC'
      },
      select: [
        'symbol'
      ]
    });
  const symbols = stocks.map(s => s.symbol);

  let count = 0;
  const failed = [];
  for await (const symbol of symbols) {
    try {
      await syncStockEps(symbol);
      console.log(JOB_NAME, symbol, `${++count}/${symbols.length} done`);
      await sleep(sleepTime);
    } catch (e) {
      const errorJson = errorToJson(e);
      const msg = `${JOB_NAME} ${Symbol} ${++count}/${symbols.length} failed ${JSON.stringify(errorJson)}`
      console.error(msg, e);
      failed.push(msg);
    }
  }

  await executeWithDataEvents('refresh materialized views', JOB_NAME, refreshMaterializedView);

  for (const err of failed) {
    console.error(err);
  }
});
