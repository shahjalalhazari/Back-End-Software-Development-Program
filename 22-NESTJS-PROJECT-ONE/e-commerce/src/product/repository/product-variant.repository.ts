import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '../entity/product-variant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly repository: Repository<ProductVariant>,
  ) {}

  create(data: Partial<ProductVariant>): ProductVariant {
    return this.repository.create(data);
  }

  save(variant: ProductVariant): Promise<ProductVariant> {
    return this.repository.save(variant);
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

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
