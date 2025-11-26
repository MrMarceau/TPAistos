import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './debt.entity';

@Injectable()
export class DebtService {
  constructor(
    @InjectRepository(Debt)
    private readonly repo: Repository<Debt>
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const debt = await this.repo.findOne({ where: { id } });
    if (!debt) {
      throw new NotFoundException('Debt not found');
    }
    return debt;
  }
}
