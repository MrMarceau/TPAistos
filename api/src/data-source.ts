import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Debt } from './debt/debt.entity';
import { CreateDebt1701020000000 } from './migrations/1701020000000-CreateDebt';

const defaultDbUrl = 'postgresql://tpaistos:tpaistos@db:5432/tpaistos';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || defaultDbUrl,
  entities: [Debt],
  migrations: [CreateDebt1701020000000],
  synchronize: false,
  logging: false
});
