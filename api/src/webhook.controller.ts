import { Controller, Headers, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { DebtService } from './debt/debt.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly debtService: DebtService) {}

  @Post('stripe')
  async stripeWebhook(
    @Req() req: Request & { rawBody: Buffer },
    @Headers('stripe-signature') signature: string
  ) {
    const event = this.debtService.verifyStripeSignature(req.rawBody, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.debtService.handlePaymentSucceeded(event.data.object as any);
        break;
      default:
        break;
    }

    return { received: true };
  }
}
