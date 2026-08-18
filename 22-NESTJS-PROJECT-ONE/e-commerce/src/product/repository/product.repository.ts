import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product, ProductStatus } from '../entity/product.entity';
import {
  ProductQueryDto,
  ProductSortBy,
  SortOrder,
} from '../dto/product-query-dto/product-query.dto';
import { ProductListResult } from '../product.service';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // CREATE
  create(product: Partial<Product>): Product {
    return this.productRepository.create(product);
  }

  // SAVE
  save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  // FIND ALL ACTIVE PRODUCTS
  findAll(): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // FIND BY ID
  findById(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
    });
  }

  // FIND BY ID INCLUDING SOFT-DELETED
  findByIdWithDeleted(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      withDeleted: true,
    });
  }

  // FIND BY STORE
  findByStoreId(storeId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { storeId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // FIND BY STORE + SKU
  findByStoreAndSku(storeId: string, sku: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { storeId, sku },
    });
  }

  // FIND BY STORE + SLUG
  findByStoreAndSlug(storeId: string, slug: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { storeId, slug },
    });
  }

  // SOFT DELETE
  softDelete(id: string) {
    return this.productRepository.softDelete(id);
  }

  // RESTORE
  restore(id: string) {
    return this.productRepository.restore(id);
  }

  // FIND PRODUCTS WITH FILTERS
  async findWithFilters(query: ProductQueryDto): Promise<ProductListResult> {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy = ProductSortBy.CREATED_AT,
      sortOrder = SortOrder.DESC,
    } = query;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.status = :status', {
        status: ProductStatus.PUBLISHED,
      });

    // CATEGORY FILTER
    if (categoryId) {
      queryBuilder
        .innerJoin(
          'product_categories',
          'productCategory',
          'productCategory.productId = product.id',
        )
        .andWhere('productCategory.categoryId = :categoryId', { categoryId });
    }

    // SEARCH
    if (search) {
      queryBuilder.andWhere(
        `(
          product.name ILIKE :search
          OR product.description ILIKE :search
          OR product.sku ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    // MIN PRICE
    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice,
      });
    }

    // MAX PRICE
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice,
      });
    }

    // PAGINATION
    const skip = (page - 1) * limit;
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder).skip(skip).take(limit);

    // EXECUTE QUERY
    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      products,
      total,
    };
  }
}
