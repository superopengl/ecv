import { ViewEntity, Connection } from 'typeorm';
import { StockPublishInformationBase } from './StockPublishInformationBase';
import { StockHistoricalPublishInformation } from './StockHistoricalPublishInformation';


@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .from(StockHistoricalPublishInformation, 'h')
    .select('*')
    .distinctOn(['h.symbol'])
    .orderBy('h.symbol')
    .addOrderBy('h.publishedAt', 'DESC')
})
export class StockLastPublishInformation extends StockPublishInformationBase {
}

@ViewEntity({
  expression: (connection: Connection) => connection.createQueryBuilder()
    .select('x.*')
    .from(q => q.from(StockHistoricalPublishInformation, 'h')
      .select('*')
      .addSelect('row_number() OVER(PARTITION BY symbol ORDER BY "publishedAt" DESC) AS row'),
      'x')
    .where(`x.row = 2`)
})
export class StockGuestPublishInformation extends StockPublishInformationBase {
}