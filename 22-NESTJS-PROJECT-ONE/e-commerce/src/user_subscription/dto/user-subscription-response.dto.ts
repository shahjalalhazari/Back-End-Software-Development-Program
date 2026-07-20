import { SubscriptionStatus } from '../../subscription/entity/subscription.entity';

export class UserSubscriptionResponseDto {
  id?: string;
  userId?: string;
  subscriptionId?: string;
  status?: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<UserSubscriptionResponseDto>) {
    Object.assign(this, partial);
  }
}
