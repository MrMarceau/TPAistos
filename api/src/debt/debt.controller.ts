import { Controller, Get, Param } from '@nestjs/common';
import { DebtService } from './debt.service';

@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Get()
  list() {
    return this.debtService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }
}
