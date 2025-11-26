import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { Debt } from './debt/debt.entity';

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
    TypeOrmModule.forFeature([Debt])
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
