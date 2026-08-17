import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from '../entity/product-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>,
  ) {}

  // ASSIGN CATEGORY TO A PRODUCT
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

  // ASSIGN MULTIPLE CATEGORIES TO A PRODUCT
  async createMany(
    productId: string,
    categoryIds: string[],
  ): Promise<ProductCategory[]> {
    if (!categoryIds.length) {
      return [];
    }

    const productCategories = categoryIds.map((categoryId) =>
      this.repository.create({
        productId,
        categoryId,
      }),
    );

    return this.repository.save(productCategories);
  }

  // GET ALL CATEGORIES OF A PRODUCT
  async findByProductId(productId: string): Promise<ProductCategory[]> {
    return this.repository.find({
      where: { productId },
    });
  }

  // GET ALL PRODUCT ASSIGNED TO A CATEGORY
  async findByCategoryId(categoryId: string): Promise<ProductCategory[]> {
    return this.repository.find({
      where: { categoryId },
    });
  }

  // CHECK IS PRODUCT ASSIGNED TO A CATEGORY
  async exists(productId: string, categoryId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        productId,
        categoryId,
      },
    });

    return count > 0;
  }

  // REMOVE A CATEGORY FROM A PRODUCT
  async remove(productId: string, categoryId: string): Promise<void> {
    await this.repository.delete({
      productId,
      categoryId,
    });
  }

  // REMOVE ALL CATEGORIES FROM A PRODUCT
  async removeAllByProductId(productId: string): Promise<void> {
    await this.repository.delete({ productId });
  }

  // REPLACE ALL PRODUCT CATEGORIES
  async replace(
    productId: string,
    categoryIds: string[],
  ): Promise<ProductCategory[]> {
    await this.removeAllByProductId(productId);

    if (!categoryIds.length) {
      return [];
    }

    return this.createMany(productId, categoryIds);
  }
}
