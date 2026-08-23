import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from './entity/user_subscription.entity';
import { UserSubscriptionRepository } from './user_subscription.repository';
import { UserSubscriptionService } from './user_subscription.service';
import { UserSubscriptionController } from './user_subscription.controller';
import { Store } from '../store/entity/store.entity';
import { StoreRepository } from '../store/store.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSubscription, Store])],
  providers: [
    UserSubscriptionService,
    UserSubscriptionRepository,
    StoreRepository,
  ],
  controllers: [UserSubscriptionController],
  exports: [UserSubscriptionService, UserSubscriptionRepository],
})
export class UserSubscriptionModule {}
