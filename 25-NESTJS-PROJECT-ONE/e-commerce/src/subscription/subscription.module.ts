import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionRepository } from './subscription.repository';
import { Subscription } from './entity/subscription.entity';
import { SubscriptionLimitsService } from './subscription-limits.service';
import { UserSubscriptionModule } from 'src/user_subscription/user_subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), UserSubscriptionModule],

  controllers: [SubscriptionController],

  providers: [
    SubscriptionRepository,
    SubscriptionService,
    SubscriptionLimitsService,
  ],

  exports: [SubscriptionLimitsService],
})
export class SubscriptionModule {}
