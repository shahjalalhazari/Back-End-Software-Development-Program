/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { Store, StoreStatus } from './entity/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreResponseDto } from './dto/store-response.dto';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  private async getStoreEntityById(id: string): Promise<Store> {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return store;
  }

  private async validateVendorCanManageStore(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (user.role !== UserRole.VENDOR) {
      throw new ForbiddenException('Only vendors can create or manage a store');
    }

    const activeSubscription = await this.userSubscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });

    if (!activeSubscription) {
      throw new ForbiddenException(
        'Vendor must have an active subscription to create or manage a store',
      );
    }

    if (
      activeSubscription.endDate &&
      new Date(activeSubscription.endDate) < new Date()
    ) {
      throw new ForbiddenException(
        'Vendor subscription has expired; store management is unavailable',
      );
    }
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async generateUniqueSlug(baseValue: string): Promise<string> {
    const baseSlug = this.slugify(baseValue);
    let slug = baseSlug;
    let suffix = 1;

    while (await this.storeRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  async create(createStoreDto: CreateStoreDto): Promise<StoreResponseDto> {
    await this.validateVendorCanManageStore(createStoreDto.userId);

    const existingStores = await this.storeRepository.findByUserId(
      createStoreDto.userId,
    );
    if (existingStores.length > 0) {
      throw new ConflictException(
        `User with id ${createStoreDto.userId} already has a store`,
      );
    }

    const slug = await this.generateUniqueSlug(
      createStoreDto.slug ?? createStoreDto.name,
    );

    const store = await this.storeRepository.create({
      ...createStoreDto,
      slug,
      status: StoreStatus.ACTIVE,
    });

    return new StoreResponseDto(store);
  }

  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.storeRepository.findAll();
    return stores.map((store) => new StoreResponseDto(store));
  }

  async findById(id: string): Promise<StoreResponseDto> {
    const store = await this.getStoreEntityById(id);
    return new StoreResponseDto(store);
  }

  async findBySlug(slug: string): Promise<StoreResponseDto> {
    const store = await this.storeRepository.findBySlug(slug);
    if (!store) {
      throw new NotFoundException(`Store with slug ${slug} not found`);
    }
    return new StoreResponseDto(store);
  }

  async findByUserId(userId: string): Promise<StoreResponseDto[]> {
    const stores = await this.storeRepository.findByUserId(userId);
    return stores.map((store) => new StoreResponseDto(store));
  }

  async findByUserStatus(
    userId: string,
    status: StoreStatus,
  ): Promise<StoreResponseDto[]> {
    const stores = await this.storeRepository.findByUserStatus(userId, status);
    return stores.map((store) => new StoreResponseDto(store));
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<StoreResponseDto> {
    const store = await this.getStoreEntityById(id);
    await this.validateVendorCanManageStore(store.userId);

    Object.assign(store, updateStoreDto);
    if (!updateStoreDto.status) {
      store.status = StoreStatus.ACTIVE;
    }

    const updatedStore = await this.storeRepository.update(store);
    return new StoreResponseDto(updatedStore);
  }

  async remove(id: string): Promise<void> {
    const store = await this.getStoreEntityById(id);
    await this.validateVendorCanManageStore(store.userId);
    await this.storeRepository.remove(store);
  }
}
