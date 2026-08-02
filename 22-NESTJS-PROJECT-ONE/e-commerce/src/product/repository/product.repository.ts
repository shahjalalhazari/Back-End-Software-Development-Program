import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // CREATE PRODUCT
  create(product: Partial<Product>): Product {
    return this.productRepository.create(product);
  }

  // SAVE PRODUCT
  save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  // FIND ALL PRODUCT
  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // FIND PRODUCT BY ID
  findById(id: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
    });
  }

  // FIND PRODUCT BY SKU
  findBySku(sku: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { sku },
    });
  }

  // FIND PRODUCT BY SLUG
  findBySlug(slug: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { slug },
    });
  }

  // FIND PRODUCT BY NAME
  findByName(name: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { name },
    });
  }

  // PRODUCT SOFT DELETE
  softDelete(id: string) {
    return this.productRepository.softDelete(id);
  }

  // PRODUCT RESTORE
  restore(id: string) {
    return this.productRepository.restore(id);
  }
}
