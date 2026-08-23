import { ForbiddenException, Injectable } from '@nestjs/common';
import { SubscriptionPlan } from './entity/subscription.entity';
import { UserSubscriptionRepository } from 'src/user_subscription/user_subscription.repository';

@Injectable()
export class SubscriptionLimitsService {
  private readonly PRODUCT_LIMITS: Record<SubscriptionPlan, number | null> = {
    [SubscriptionPlan.BASIC]: 50,
    [SubscriptionPlan.STANDARD]: 200,
    [SubscriptionPlan.PREMIUM]: null,
  };

  constructor(
    private readonly userSubscriptionRepository: UserSubscriptionRepository,
  ) {}

  /**
   * Returns the maximum number of products allowed
   * for a subscription plan. null = unlimited.
   */
  getMaxProducts(plan: SubscriptionPlan): number | null {
    return this.PRODUCT_LIMITS[plan];
  }

  /**
   * Validates whether a user can create another product.
   * currentProductCount = number of existing products
   * the store currently owns.
   */
  async validateProductCreationLimit(
    userId: string,
    currentProductCount: number,
  ): Promise<void> {
    const userSubscription =
      await this.userSubscriptionRepository.findActiveSubscriptionByUserId(
        userId,
      );

    if (!userSubscription) {
      throw new ForbiddenException(
        'You do not have an active subscription. Please subscribe to a plan before creating products.',
      );
    }

    const subscription = userSubscription.subscription;

    if (!subscription) {
      throw new ForbiddenException(
        'Your active subscription plan could not be found.',
      );
    }

    const maxProducts = this.getMaxProducts(subscription.plan);

    // PREMIUM = unlimited
    if (maxProducts === null) {
      return;
    }

    if (currentProductCount >= maxProducts) {
      throw new ForbiddenException(
        `Your ${subscription.plan} subscription allows a maximum of ${maxProducts} products. Please upgrade your subscription to create more products.`,
      );
    }
  }
}
