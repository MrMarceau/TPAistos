import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt } from './debt.entity';
import Stripe from 'stripe';

@Injectable()
export class DebtService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Debt)
    private readonly repo: Repository<Debt>
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      throw new Error('STRIPE_SECRET_KEY is missing');
    }
    this.stripe = new Stripe(stripeSecret, {
      apiVersion: '2023-10-16'
    });
  }

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

  async createPaymentIntent(debtId: string) {
    const debt = await this.findOne(debtId);
    if (debt.status === 'PAID') {
      throw new BadRequestException('Debt already paid');
    }

    const amountCents = Math.round(Number(debt.debtAmount) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      throw new InternalServerErrorException('Invalid debt amount');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      metadata: {
        debtId: debt.id,
        email: debt.email
      },
      receipt_email: debt.email
    });

    debt.stripePaymentIntentId = paymentIntent.id;
    await this.repo.save(debt);

    return { clientSecret: paymentIntent.client_secret };
  }

  async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const debtId = paymentIntent.metadata.debtId;
    if (!debtId) return;
    const debt = await this.repo.findOne({ where: { id: debtId } });
    if (!debt) return;
    debt.status = debt.status === 'PAID' ? debt.status : 'PAID';
    debt.paidAt = new Date();
    debt.stripePaymentIntentId = paymentIntent.id;
    await this.repo.save(debt);
  }

  verifyStripeSignature(rawBody: Buffer, signature: string | undefined) {
    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is missing');
    }

    return this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }
}
