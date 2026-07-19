import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const existingSubscription = await this.subscriptionRepository.findByName(
      createSubscriptionDto.name,
    );
    if (existingSubscription) {
      throw new ConflictException(
        `Subscription with name '${createSubscriptionDto.name}' already exists`,
      );
    }

    const subscription = await this.subscriptionRepository.create(
      createSubscriptionDto,
    );
    return subscription;
  }

  async findAll(): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionRepository.findAll();
  }

  async findById(id: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: Partial<CreateSubscriptionDto>,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    const updatedSubscription = { ...subscription, ...updateSubscriptionDto };
    await this.subscriptionRepository.update(updatedSubscription);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const subscription = await this.findById(id);
    await this.subscriptionRepository.remove(subscription);
  }
}
