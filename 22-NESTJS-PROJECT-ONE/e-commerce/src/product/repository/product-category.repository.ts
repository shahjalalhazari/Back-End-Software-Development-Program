import { Injectable } from '@nestjs/common';
import { ProductCategory } from '../entity/product-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>,
  ) {}

  async create(
    productId: string,
    categoryId: string,
  ): Promise<ProductCategory> {
    const productCategory = this.repository.create({
      productId,
      categoryId,
    });

    return this.repository.save(productCategory);
  }

  async createMany(
    productId: string,
    categoryIds: string[],
  ): Promise<ProductCategory[]> {
    if (!categoryIds.length) {
      return [];
    }

    const records = categoryIds.map((categoryId) =>
      this.repository.create({
        productId,
        categoryId,
      }),
    );

    return this.repository.save(records);
  }

  async findByProductId(productId: string): Promise<ProductCategory[]> {
    return this.repository.find({
      where: { productId },
      relations: {
        category: true,
      },
    });
  }

  async findByProductAndCategory(
    productId: string,
    categoryId: string,
  ): Promise<ProductCategory | null> {
    return this.repository.findOne({
      where: {
        productId,
        categoryId,
      },
    });
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.repository.delete({
      productId,
    });
  }

  async deleteByProductAndCategory(
    productId: string,
    categoryId: string,
  ): Promise<void> {
    await this.repository.delete({
      productId,
      categoryId,
    });
  }
}
