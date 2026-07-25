/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store, StoreStatus } from './entity/store.entity';

@Injectable()
export class StoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly repository: Repository<Store>,
  ) {}

  async create(store: Partial<Store>): Promise<Store> {
    const newStore = this.repository.create(store);
    return await this.repository.save(newStore);
  }

  async findAll(): Promise<Store[]> {
    return await this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Store | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    return await this.repository.findOne({ where: { slug } });
  }

  async findByUserId(userId: string): Promise<Store[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserStatus(
    userId: string,
    status: StoreStatus,
  ): Promise<Store[]> {
    return await this.repository.find({
      where: { userId, status },
      order: { createdAt: 'DESC' },
    });
  }

  async update(store: Store): Promise<Store> {
    return await this.repository.save(store);
  }

  async remove(store: Store): Promise<void> {
    await this.repository.remove(store);
  }
}
