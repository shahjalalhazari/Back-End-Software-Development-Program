import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from './entity/user_subscription.entity';
import { UserSubscriptionRepository } from './user_subscription.repository';
import { UserSubscriptionService } from './user_subscription.service';
import { UserSubscriptionController } from './user_subscription.controller';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscription]), SubscriptionModule],
  providers: [UserSubscriptionService, UserSubscriptionRepository],
  controllers: [UserSubscriptionController],
  exports: [UserSubscriptionService],
})
export class UserSubscriptionModule {}
