import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../entity/product-variant.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly repository: Repository<ProductVariant>,
  ) {}

  create(data: Partial<ProductVariant>): ProductVariant {
    return this.repository.create(data);
  }

  async save(variant: ProductVariant): Promise<ProductVariant> {
    return this.repository.save(variant);
  }

  async saveMany(variants: ProductVariant[]): Promise<ProductVariant[]> {
    return this.repository.save(variants);
  }

  async findById(id: string): Promise<ProductVariant | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByProductId(productId: string): Promise<ProductVariant[]> {
    return this.repository.find({
      where: { productId },
      order: {
        position: 'ASC',
      },
    });
  }

  async findByStoreAndSku(
    storeId: string,
    sku: string,
  ): Promise<ProductVariant | null> {
    return this.repository.findOne({
      where: {
        storeId,
        sku,
      },
    });
  }

  async findByProductAndCombination(
    productId: string,
    option1: string,
    option2: string | null,
    option3: string | null,
  ): Promise<ProductVariant | null> {
    return this.repository.findOne({
      where: {
        productId,
        option1,
        option2: option2 === null ? IsNull() : option2,
        option3: option3 === null ? IsNull() : option3,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
