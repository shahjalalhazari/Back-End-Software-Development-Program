import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { StoreService } from 'src/store/store.service';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly storeService: StoreService,
  ) {}

  // GENERATE UNIQUE SLUG
  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async generateUniqueSlug(baseValue: string): Promise<string> {
    const baseSlug = this.slugify(baseValue);
    let slug = baseSlug;
    let suffix = 1;

    while (await this.productRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  // CREATE PRODUCT
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const store = await this.storeService.findById(createProductDto.storeId);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const slug = await this.generateUniqueSlug(
      createProductDto.slug ?? createProductDto.name,
    );

    const product = this.productRepository.create({
      ...createProductDto,
      storeId: createProductDto.storeId,
      slug,
    });

    const savedProduct = await this.productRepository.save(product);

    return new ProductResponseDto(savedProduct);
  }

  // FIND ALL PRODUCT
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();

    return products.map(
      (product) => new ProductResponseDto(product)
    );
  }
}
