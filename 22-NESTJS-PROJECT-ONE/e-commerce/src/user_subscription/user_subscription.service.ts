import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSubscriptionRepository } from './user_subscription.repository';
import { StoreRepository } from 'src/store/store.repository';
import { SubscriptionStatus } from 'src/subscription/entity/subscription.entity';
import { StoreStatus } from 'src/store/entity/store.entity';
import { CreateUserSubscriptionDto } from './dto/create-user-subscription.dto';
import { UserSubscriptionResponseDto } from './dto/user-subscription-response.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user-subscription.dto';

@Injectable()
export class UserSubscriptionService {
  constructor(
    private readonly repository: UserSubscriptionRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  private async syncStoreStatusForUser(
    userId: string,
    status: SubscriptionStatus,
  ): Promise<void> {
    const storeStatus =
      status === SubscriptionStatus.ACTIVE
        ? StoreStatus.ACTIVE
        : StoreStatus.INACTIVE;

    const stores = await this.storeRepository.findByUserId(userId);

    for (const store of stores) {
      store.status = storeStatus;
      await this.storeRepository.update(store);
    }
  }

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

    const startDate = dto.startDate ? new Date(dto.startDate) : new Date();

    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException(
        'Subscription end date must be after start date',
      );
    }

    const userSubscription = await this.repository.create({
      userId: dto.userId,
      subscriptionId: dto.subscriptionId,
      status: dto.status ?? SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      autoRenew: dto.autoRenew ?? false,
      paymentId: dto.paymentId ?? null,
    });

    await this.syncStoreStatusForUser(dto.userId, userSubscription.status);

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

    const endDate = new Date(newEndDate);

    if (endDate <= new Date()) {
      throw new BadRequestException(
        'New subscription end date must be in the future',
      );
    }

    existing.endDate = endDate;
    existing.status = SubscriptionStatus.ACTIVE;

    const updated = await this.repository.update(existing);

    await this.syncStoreStatusForUser(existing.userId, updated.status);

    return new UserSubscriptionResponseDto(updated);
  }

  async expire(id: string): Promise<UserSubscriptionResponseDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    existing.status = SubscriptionStatus.EXPIRED;

    const updated = await this.repository.update(existing);

    await this.syncStoreStatusForUser(existing.userId, updated.status);

    return new UserSubscriptionResponseDto(updated);
  }

  async cancel(id: string): Promise<UserSubscriptionResponseDto> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      throw new NotFoundException(`User subscription with ID ${id} not found`);
    }

    existing.status = SubscriptionStatus.CANCELLED;

    const updated = await this.repository.update(existing);

    await this.syncStoreStatusForUser(existing.userId, updated.status);

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

    const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;

    if (endDate <= existing.startDate) {
      throw new BadRequestException(
        'Subscription end date must be after start date',
      );
    }

    const updated = await this.repository.update({
      ...existing,
      ...dto,
      endDate,
      autoRenew:
        dto.autoRenew !== undefined ? dto.autoRenew : existing.autoRenew,
    });

    await this.syncStoreStatusForUser(existing.userId, updated.status);

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
