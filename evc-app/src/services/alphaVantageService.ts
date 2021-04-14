import * as queryString from 'query-string';
import * as _ from 'lodash';
import * as fetch from 'node-fetch';
import * as parse from 'csv-parse/lib/sync';

// const alphaApi = alphavantage({key: process.env.ALPHAVANTAGE_API_KEY});

export async function getEarnings(symbol: string, howManyQuarters = 4) {
  const resp = await requestAlphaVantageApi({
    function: 'EARNINGS',
    symbol,
  });
  const quarterlyEarnings = resp?.quarterlyEarnings || [];
  const result = _.chain(quarterlyEarnings)
    .filter(x => _.isFinite(+(x.reportedEPS)))
    .take(howManyQuarters)
    .value();
  return result;
}

export async function getHistoricalClose(symbol: string, days = 1) {
  const resp = await requestAlphaVantageApi({
    function: 'TIME_SERIES_DAILY',
    symbol,
    datatype: 'json',
    outputsize: days <= 100 ? 'compact' : 'full'
  });
  const list = resp['Time Series (Daily)'];

  const result = _.chain(Object.entries(list))
    .map(([date, value]) => ({
      date,
      close: value['4. close']
    }))
    .filter(x => _.isFinite(+(x.close)))
    .take(days)
    .value();

  return result;
}

export async function getEarningsCalendarForAll(): Promise<{symbol: string, reportDate: string}[]> {
  const data = await requestAlphaVantageApi({
    function: 'EARNINGS_CALENDAR',
    horizon: '12month',
    // symbol: 'AAPL'
  }, 'text');

  const rows = parse(data, {
    columns: true,
    skip_empty_lines: true
  });

  return rows;
}

export async function getCompanyName(symbol: string) {
  const data = await requestAlphaVantageApi({
    function: 'OVERVIEW',
    symbol
  });

  return data?.Name;
}


async function requestAlphaVantageApi(query?: object, format: 'json' | 'text' = 'json') {
  const queryParams = queryString.stringify({
    ...query,
    apikey: process.env.ALPHAVANTAGE_API_KEY
  });
  const url = `${process.env.ALPHAVANTAGE_API_ENDPOINT}/query?${queryParams}`;
  const resp = await fetch(url, query);
  console.debug('alphavantage request'.bgMagenta.white, resp.status, url.magenta);
  if (/^4/.test(`${resp.status}`)) {
    // 429 Too Many Requests
    // 404 Sandbox doesn't return data
    return null;
  }
  return format === 'json' ? resp.json() : resp.text();
}