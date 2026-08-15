import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from '../entity/product-image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImageRepository {
  constructor(
    @InjectRepository(ProductImage)
    private readonly repository: Repository<ProductImage>,
  ) {}

  create(data: Partial<ProductImage>): ProductImage {
    return this.repository.create(data);
  }

  save(image: ProductImage): Promise<ProductImage> {
    return this.repository.save(image);
  }

  findById(id: string): Promise<ProductImage | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  findByProductId(productId: string): Promise<ProductImage[]> {
    return this.repository.find({
      where: { productId },
      order: {
        position: 'ASC',
      },
    });
  }

  findPrimaryByProductId(productId: string): Promise<ProductImage | null> {
    return this.repository.findOne({
      where: {
        productId,
        isPrimary: true,
      },
    });
  }

  async clearPrimary(productId: string): Promise<void> {
    await this.repository.update(
      {
        productId,
        isPrimary: true,
      },
      {
        isPrimary: false,
      },
    );
  }

  async updatePosition(id: string, position: number): Promise<void> {
    await this.repository.update({ id }, { position });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
