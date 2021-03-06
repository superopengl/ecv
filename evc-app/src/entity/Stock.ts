import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { StockTag } from './StockTag';

@Entity()
export class Stock {
  @PrimaryColumn()
  symbol: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  logoUrl: string;

  @ManyToMany(type => StockTag, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: StockTag[];
}
