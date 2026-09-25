import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entity/store.entity';
import { StoreRepository } from './store.repository';
import { User } from '../user/entity/user.entity';
import { UserSubscription } from '../user_subscription/entity/user_subscription.entity';
import { UserModule } from '../user/user.module';
import { UserSubscriptionRepository } from '../user_subscription/user_subscription.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, User, UserSubscription]),
    UserModule,
  ],
  providers: [StoreService, StoreRepository, UserSubscriptionRepository],
  controllers: [StoreController],
  exports: [StoreService, StoreRepository],
})
export class StoreModule {}
