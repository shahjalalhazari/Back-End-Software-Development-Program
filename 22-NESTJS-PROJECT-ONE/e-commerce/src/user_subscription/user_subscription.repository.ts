/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UserSubscription } from './entity/user_subscription.entity';

@Injectable()
export class UserSubscriptionRepository {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly repository: Repository<UserSubscription>,
  ) {}

  async create(userSubscription: Partial<UserSubscription>): Promise<UserSubscription> {
    const newUserSubscription = this.repository.create(userSubscription);
    return await this.repository.save(newUserSubscription);
  }

  async findAll(): Promise<UserSubscription[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<UserSubscription | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByUserAndSubscription(userId: string, subscriptionId: string): Promise<UserSubscription | null> {
    return await this.repository.findOne({
      where: { userId, subscriptionId },
    });
  }

  async findByUserId(userId: string): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySubscriptionId(subscriptionId: string): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { subscriptionId },
      order: { createdAt: 'DESC' },
    });
  }

  async findExpiredSubscriptions(): Promise<UserSubscription[]> {
    return await this.repository.find({
      where: { endDate: LessThan(new Date()) },
      order: { endDate: 'ASC' },
    });
  }

  async update(userSubscription: UserSubscription): Promise<UserSubscription> {
    return await this.repository.save(userSubscription);
  }

  async remove(userSubscription: UserSubscription): Promise<void> {
    await this.repository.remove(userSubscription);
  }
}
