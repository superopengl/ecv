import { getManager } from 'typeorm';
import { StockDailyPutCallRatio } from '../entity/StockDailyPutCallRatio';


export type StockAdvancedStatsInfo = {
  symbol: string;
  putCallRatio: number;
  date: string;
  rawResponse: any;
}

export async function syncManyStockPutCallRatio(info: StockAdvancedStatsInfo[]) {
  const entites = info.map(item => {
    const { symbol, putCallRatio, date, rawResponse } = item;
    if(!putCallRatio || !date) {
      return null;
    }

    const entity = new StockDailyPutCallRatio();
    entity.symbol = symbol;
    entity.putCallRatio = putCallRatio;
    entity.date = date;
    return entity;
  }).filter(x => !!x);

  await getManager()
    .createQueryBuilder()
    .insert()
    .into(StockDailyPutCallRatio)
    .values(entites)
    .orIgnore()
    .execute();
}


