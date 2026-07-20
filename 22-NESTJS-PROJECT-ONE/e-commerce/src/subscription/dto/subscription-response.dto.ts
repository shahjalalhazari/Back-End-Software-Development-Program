import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../entity/subscription.entity';

export class SubscriptionResponseDto {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  autoRenew?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<SubscriptionResponseDto>) {
    Object.assign(this, partial);
  }
}
