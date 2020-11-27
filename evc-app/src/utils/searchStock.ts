import { getManager } from 'typeorm';
import { Stock } from '../entity/Stock';
import { StockPublish } from '../entity/StockPublish';
import { StockSupport } from '../entity/StockSupport';
import { StockResistance } from '../entity/StockResistance';
import { StockValue } from '../entity/StockValue';
import { StockSearchParams } from "../types/StockSearchParams";
import { assert } from './assert';

export async function searchStock(queryInfo: StockSearchParams) {
  const { symbols, text, tags, orderField, orderDirection } = queryInfo;

  const skip = queryInfo.skip || 0;
  const limit = queryInfo.limit || 50;
  assert(skip >= 0 && limit > 0, 400, 'Invalid page and size parameter');

  let query = getManager()
    .createQueryBuilder()
    .from(Stock, 's')
    .where('1 = 1');

  if (symbols?.length) {
    query = query.andWhere(`s.symbol IN (:...symbols)`, { symbols: symbols.map(s => s.toUpperCase()) });
  }
  if (text) {
    query = query.andWhere('s.symbol ILIKE :text OR s.company ILIKE :text', { text: `%${text}%` });
  }
  // if (from) {
  //   query = query.andWhere('s."createdAt" >= :date', { data: moment(from).toDate() });
  // }
  // if (to) {
  //   query = query.andWhere('s."createdAt" <= :date', { data: moment(to).toDate() });
  // }
  query = query
    .leftJoin(q => q.from(StockPublish, 'pu')
      .distinctOn(['pu.symbol'])
      .orderBy('pu.symbol')
      .addOrderBy('pu.createdAt', 'DESC'),
      'pu', 'pu.symbol = s.symbol')
    .leftJoin(StockSupport, 'ss', 'pu."supportId" = ss.id')
    .leftJoin(StockResistance, 'sr', 'pu."resistanceId" = sr.id')
    .leftJoin(StockValue, 'sv', 'pu."valueId" = sv.id');
  if (tags?.length) {
    // Filter by tags
    query = query.innerJoin(q => q.from('stock_tags_stock_tag', 'tg')
      .innerJoin(
        sq => sq.from('stock_tags_stock_tag', 'stg')
          .where(`stg."stockTagId" IN (:...tags)`, { tags }),
        'stg',
        'stg."stockSymbol" = tg."stockSymbol"'
      )
      .groupBy('tg."stockSymbol"')
      .select([
        'tg."stockSymbol" as symbol',
        'array_agg(tg."stockTagId") as tags'
      ]),
      'tag', 'tag.symbol = s.symbol');
  } else {
    query = query.leftJoin(q => q.from('stock_tags_stock_tag', 'tg')
      .groupBy('tg."stockSymbol"')
      .select([
        'tg."stockSymbol" as symbol',
        'array_agg(tg."stockTagId") as tags'
      ]),
      'tag', 'tag.symbol = s.symbol');
  }
  query = query.orderBy('s.symbol')
    .addOrderBy(`pu."${orderField || 'createdAt'}"`, orderDirection || 'DESC')
    .select([
      's.*',
      'tag.tags',
      'pu."createdAt" as "publishedAt"',
      'ss.lo as "supportLo"',
      'ss.hi as "supportHi"',
      'sr.lo as "resistanceLo"',
      'sr.hi as "resistanceHi"',
      'sv.lo as "valueLo"',
      'sv.hi as "valueHi"',
    ])
    .offset(skip)
    .limit(limit);

  const list = await query.execute();
  return list;
}