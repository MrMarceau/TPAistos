import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt } from './debt.entity';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Debt])],
  providers: [DebtService],
  controllers: [DebtController],
  exports: [DebtService]
})
export class DebtModule {}
