import { Injectable } from '@nestjs/common';
import { UserSubscription } from './entity/user_subscription.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionStatus } from 'src/subscription/entity/subscription.entity';

@Injectable()
export class UserSubscriptionRepository {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly repository: Repository<UserSubscription>,
  ) {}

  async create(
    userSubscription: Partial<UserSubscription>,
  ): Promise<UserSubscription> {
    const newUserSubscription = this.repository.create(userSubscription);

    return await this.repository.save(newUserSubscription);
  }

  async findAll(): Promise<UserSubscription[]> {
    return await this.repository.find({
      relations: { subscription: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<UserSubscription | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { subscription: true },
    });
  }

  async findByUserAndSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<UserSubscription | null> {
    return await this.repository.findOne({
      where: {
        userId,
        subscriptionId,
      },
      relations: { subscription: true },
    });
  }

  async findByUserId(userId: string): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { userId },
      relations: { subscription: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySubscriptionId(
    subscriptionId: string,
  ): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { subscriptionId },
      relations: { subscription: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findExpiredSubscriptions(): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: {
        endDate: LessThan(new Date()),
      },
      relations: {
        subscription: true,
      },
      order: {
        endDate: 'ASC',
      },
    });
  }

  /**
   * Returns the user's currently active subscription.
   *
   * Conditions:
   * - status = ACTIVE
   * - startDate <= now
   * - endDate > now
   */
  async findActiveSubscriptionByUserId(
    userId: string,
  ): Promise<UserSubscription | null> {
    const now = new Date();

    return await this.repository
      .createQueryBuilder('userSubscription')
      .leftJoinAndSelect('userSubscription.subscription', 'subscription')
      .where('userSubscription.userId = :userId', {
        userId,
      })
      .andWhere('userSubscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .andWhere('userSubscription.startDate <= :now', {
        now,
      })
      .andWhere('userSubscription.endDate > :now', {
        now,
      })
      .andWhere('subscription.status = :subscriptionStatus', {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      })
      .orderBy('userSubscription.endDate', 'DESC')
      .getOne();
  }

  async update(userSubscription: UserSubscription): Promise<UserSubscription> {
    return await this.repository.save(userSubscription);
  }

  async remove(userSubscription: UserSubscription): Promise<void> {
    await this.repository.remove(userSubscription);
  }
}
