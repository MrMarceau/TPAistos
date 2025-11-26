import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Debt } from './debt/debt.entity';
import { DebtModule } from './debt/debt.module';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://tpaistos:tpaistos@db:5432/tpaistos';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: databaseUrl,
      entities: [Debt],
      synchronize: false,
      autoLoadEntities: true
    }),
    TypeOrmModule.forFeature([Debt]),
    DebtModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
