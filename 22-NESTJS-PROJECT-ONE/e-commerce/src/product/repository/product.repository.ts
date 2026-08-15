import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entity/product.entity';

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
}
