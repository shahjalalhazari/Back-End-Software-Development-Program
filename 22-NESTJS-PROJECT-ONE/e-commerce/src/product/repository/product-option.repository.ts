import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOption } from '../entity/product-option.entity';
import { Repository } from 'typeorm';
import { ProductVariant } from '../entity/product-variant.entity';

@Injectable()
export class ProductOptionRepository {
  constructor(
    @InjectRepository(ProductOption)
    private readonly repository: Repository<ProductOption>,
  ) {}

  async create(data: Partial<ProductOption>): Promise<ProductOption> {
    const option = this.repository.create(data);

    return this.repository.save(option);
  }

  async save(option: ProductOption): Promise<ProductOption> {
    return this.repository.save(option);
  }

  async saveMany(variants: ProductVariant[]): Promise<ProductVariant[]> {
    return this.repository.save(variants);
  }

  async findById(id: string): Promise<ProductOption | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByProductId(productId: string): Promise<ProductOption[]> {
    return this.repository.find({
      where: { productId },
      order: {
        position: 'ASC',
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.repository.delete({
      productId,
    });
  }
}
