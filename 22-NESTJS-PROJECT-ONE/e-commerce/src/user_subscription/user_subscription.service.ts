import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';
import { UserSubscriptionResponseDto } from './dto/user-subscription-response.dto';
import { SubscriptionStatus } from '../subscription/entity/subscription.entity';
import { UserSubscriptionRepository } from './user_subscription.repository';

@Injectable()
export class UserSubscriptionService {
  constructor(private readonly repository: UserSubscriptionRepository) {}

  async subscribe(
    dto: CreateUserSubscriptionDto,
  ): Promise<UserSubscriptionResponseDto> {
    const existingSubscription =
      await this.repository.findByUserAndSubscription(
        dto.userId,
        dto.subscriptionId,
      );

    if (existingSubscription) {
      throw new ConflictException(
        'User is already subscribed to this subscription plan',
      );
    }

    const userSubscription = await this.repository.create({
      ...dto,
      status: dto.status ?? SubscriptionStatus.ACTIVE,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      autoRenew: dto.autoRenew ?? false,
    });

    return new UserSubscriptionResponseDto(userSubscription);
  }

  async findAll(): Promise<UserSubscriptionResponseDto[]> {
    const userSubscriptions = await this.repository.findAll();
    return userSubscriptions.map(
      (item) => new UserSubscriptionResponseDto(item),
    );
  }

  async findById(id: string): Promise<UserSubscriptionResponseDto> {
    const userSubscription = await this.repository.findById(id);

    if (!userSubscription) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    return new UserSubscriptionResponseDto(userSubscription);
  }

  async findByUserId(userId: string): Promise<UserSubscriptionResponseDto[]> {
    const userSubscriptions = await this.repository.findByUserId(userId);
    return userSubscriptions.map(
      (item) => new UserSubscriptionResponseDto(item),
    );
  }

  async findBySubscriptionId(
    subscriptionId: string,
  ): Promise<UserSubscriptionResponseDto[]> {
    const userSubscriptions =
      await this.repository.findBySubscriptionId(subscriptionId);
    return userSubscriptions.map(
      (item) => new UserSubscriptionResponseDto(item),
    );
  }

  async findExpiredSubscriptions(): Promise<UserSubscriptionResponseDto[]> {
    const userSubscriptions = await this.repository.findExpiredSubscriptions();
    return userSubscriptions.map(
      (item) => new UserSubscriptionResponseDto(item),
    );
  }

  async renew(
    id: string,
    newEndDate: string,
  ): Promise<UserSubscriptionResponseDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    existing.endDate = new Date(newEndDate);
    existing.status = SubscriptionStatus.ACTIVE;

    const updated = await this.repository.update(existing);
    return new UserSubscriptionResponseDto(updated);
  }

  async expire(id: string): Promise<UserSubscriptionResponseDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    existing.status = SubscriptionStatus.EXPIRED;
    const updated = await this.repository.update(existing);
    return new UserSubscriptionResponseDto(updated);
  }

  async cancel(id: string): Promise<UserSubscriptionResponseDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    existing.status = SubscriptionStatus.CANCELLED;
    const updated = await this.repository.update(existing);
    return new UserSubscriptionResponseDto(updated);
  }

  async update(
    id: string,
    dto: UpdateUserSubscriptionDto,
  ): Promise<UserSubscriptionResponseDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    const updated = await this.repository.update({
      ...existing,
      ...dto,
      autoRenew:
        dto.autoRenew !== undefined ? dto.autoRenew : existing.autoRenew,
      endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
    });

    return new UserSubscriptionResponseDto(updated);
  }

  async remove(id: string): Promise<void> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    await this.repository.remove(existing);
  }
}
