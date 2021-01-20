import { Entity, Column, Index, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, OneToMany, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { ColumnNumericTransformer } from '../utils/ColumnNumericTransformer';
import { Stock } from './Stock';
import { StockPublish } from './StockPublish';
import { StockEps } from './StockEps';
import { StockPe } from './StockPe';


@Entity()
@Index(['symbol', 'createdAt'])
export class StockFairValue {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;
  
  @Column()
  symbol: string;

  @Column('uuid')
  author: string;

  @Column('decimal', { transformer: new ColumnNumericTransformer(), nullable: true })
  lo: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer(), nullable: true })
  hi: number;

  @Column('int2', { default: 0 })
  loTrend: number;

  @Column('int2', { default: 0 })
  hiTrend: number;

  @Column({ default: false })
  special: boolean;

  @Column('uuid', {array: true})
  epsIds: string[];

  @Column('uuid')
  peId: string;

  @Column({default: false})
  published: boolean;
}
