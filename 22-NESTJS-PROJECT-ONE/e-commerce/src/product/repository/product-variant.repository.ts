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

  findById(id: string): Promise<ProductVariant | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByProductId(productId: string): Promise<ProductVariant[]> {
    return this.repository.find({
      where: { productId },
      order: {
        position: 'ASC',
      },
    });
  }

  findByStoreAndSku(
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
    option1?: string,
    option2?: string,
    option3?: string,
  ): Promise<ProductVariant | null> {
    return this.repository.findOne({
      where: {
        productId,
        option1: option1 ?? IsNull(),
        option2: option2 ?? IsNull(),
        option3: option3 ?? IsNull(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
