import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entity/store.entity';
import { StoreRepository } from './store.repository';
import { User } from '../user/entity/user.entity';
import { UserSubscription } from '../user_subscription/entity/user_subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, UserSubscription])],
  providers: [StoreService, StoreRepository],
  controllers: [StoreController],
  exports: [StoreService, StoreRepository],
})
export class StoreModule {}
