import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { StoreService } from 'src/store/store.service';
import { StoreStatus } from 'src/store/entity/store.entity';
import { Product, ProductStatus } from './entity/product.entity';
import { CreateProductDto } from './dto/product-dtos/create-product.dto';
import { ProductResponseDto } from './dto/product-dtos/product-response.dto';
import { ProductMapper } from './mapper/product.mapper';
import { UpdateProductDto } from './dto/product-dtos/update-product.dto';
import { ProductCategoryRepository } from './repository/product-category.repository';
import { ProductTagRepository } from './repository/product-tag.repository';
import { ProductTagAssignmentRepository } from './repository/product-tag-assignment.repository';
import { ProductImageRepository } from './repository/product-image.repository';
import { ProductImage } from './entity/product-image.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly storeService: StoreService,
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly productTagRepository: ProductTagRepository,
    private readonly productTagAssignmentRepository: ProductTagAssignmentRepository,
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  // -----------------------------------------
  // SLUGIFY
  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // -----------------------------------------
  // GENERATE UNIQUE SLUG
  private async generateUniqueSlug(
    value: string,
    storeId: string,
    currentProductId?: string,
  ): Promise<string> {
    const baseSlug = this.slugify(value) || 'product';

    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existingProduct = await this.productRepository.findByStoreAndSlug(
        storeId,
        slug,
      );

      if (!existingProduct || existingProduct.id === currentProductId) {
        return slug;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }

  // -----------------------------------------
  // VALIDATE STORE
  private async validateActiveStore(storeId: string) {
    const store = await this.storeService.findById(storeId);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.status !== StoreStatus.ACTIVE) {
      throw new ForbiddenException(
        'Store must be active before creating or publishing products',
      );
    }

    return store;
  }

  // -----------------------------------------
  // VALIDATE PRODUCT FOR PUBLISH
  private validateProductForPublishing(product: Product): void {
    if (!product.name?.trim()) {
      throw new BadRequestException(
        'Product name is required before publishing',
      );
    }

    if (!product.description?.trim()) {
      throw new BadRequestException(
        'Product description is required before publishing',
      );
    }

    if (
      product.price === undefined ||
      product.price === null ||
      product.price < 0
    ) {
      throw new BadRequestException(
        'Product price must be a valid non-negative number',
      );
    }

    if (!product.slug?.trim()) {
      throw new BadRequestException(
        'Product slug is required before publishing',
      );
    }
  }

  // -----------------------------------------
  // GENERATE UNIQUE TAG SLUG
  private async generateUniqueTagSlug(
    storeId: string,
    name: string,
  ): Promise<string> {
    const baseSlug = this.slugify(name) || 'tag';

    let slug = baseSlug;
    let suffix = 1;

    while (await this.productTagRepository.findByStoreAndSlug(storeId, slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    return slug;
  }

  // -----------------------------------------
  // ASSIGN CATEGORIES
  private async assignCategories(
    productId: string,
    categoryIds: string[] | undefined,
  ): Promise<void> {
    if (!categoryIds?.length) {
      return;
    }

    const uniqueCategoryIds = [...new Set(categoryIds)];

    await this.productCategoryRepository.createMany(
      productId,
      uniqueCategoryIds,
    );
  }

  // -----------------------------------------
  // ASSIGN TAGS
  private async assignTags(
    productId: string,
    storeId: string,
    tags?: string[],
  ): Promise<void> {
    if (!tags?.length) {
      return;
    }

    const uniqueTags = [
      ...new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
    ];

    for (const tagName of uniqueTags) {
      let tag = await this.productTagRepository.findByStoreAndName(
        storeId,
        tagName,
      );

      if (!tag) {
        const slug = await this.generateUniqueTagSlug(storeId, tagName);

        const createdTag = this.productTagRepository.create({
          storeId,
          name: tagName,
          slug,
        });

        tag = await this.productTagRepository.save(createdTag);
      }

      await this.productTagAssignmentRepository.create(productId, tag.id);
    }
  }

  // -----------------------------------------
  // UPDATE CATEGORIES
  private async updateCategories(
    productId: string,
    categoryIds?: string[],
  ): Promise<void> {
    if (categoryIds === undefined) {
      return;
    }

    await this.productCategoryRepository.deleteByProductId(productId);

    if (categoryIds.length === 0) {
      return;
    }

    const uniqueCategoryIds = [...new Set(categoryIds)];

    await this.productCategoryRepository.createMany(
      productId,
      uniqueCategoryIds,
    );
  }

  // -----------------------------------------
  // UPDATE TAGS
  private async updateTags(
    productId: string,
    storeId: string,
    tags: string[] | undefined,
  ): Promise<void> {
    if (tags === undefined) {
      return;
    }

    await this.productTagAssignmentRepository.deleteByProductId(productId);

    if (tags.length === 0) {
      return;
    }

    await this.assignTags(productId, storeId, tags);
  }

  // -----------------------------------------
  // CREATE
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    await this.validateActiveStore(createProductDto.storeId);

    const slug = await this.generateUniqueSlug(
      createProductDto.slug ?? createProductDto.name,
      createProductDto.storeId,
    );

    if (createProductDto.sku) {
      const existingSku = await this.productRepository.findByStoreAndSku(
        createProductDto.storeId,
        createProductDto.sku,
      );

      if (existingSku) {
        throw new ConflictException('Product SKU already exists in this store');
      }
    }

    const product = this.productRepository.create({
      storeId: createProductDto.storeId,

      name: createProductDto.name,
      slug,
      description: createProductDto.description,
      shortDescription: createProductDto.shortDescription,

      price: createProductDto.price,
      compareAtPrice: createProductDto.compareAtPrice,
      costPrice: createProductDto.costPrice,

      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      status: ProductStatus.DRAFT,

      trackInventory: createProductDto.trackInventory ?? true,
      allowBackorders: createProductDto.allowBackorders ?? false,
      quantity: createProductDto.quantity ?? 0,
      lowStockThreshold: createProductDto.lowStockThreshold ?? 10,

      weight: createProductDto.weight,
      dimensions: createProductDto.dimensions,
      isDigital: createProductDto.isDigital ?? false,

      metaTitle: createProductDto.metaTitle,
      metaDescription: createProductDto.metaDescription,
    });

    const savedProduct = await this.productRepository.save(product);

    await this.assignCategories(savedProduct.id, createProductDto.categoryIds);

    await this.assignTags(
      savedProduct.id,
      savedProduct.storeId,
      createProductDto.tags,
    );

    return ProductMapper.toResponse(savedProduct);
  }

  // -----------------------------------------
  // FIND ALL
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();

    return ProductMapper.toResponseList(products);
  }

  // -----------------------------------------
  // FIND BY ID
  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponse(product);
  }

  // -----------------------------------------
  // FIND BY STORE + SKU
  async findByStoreAndSku(
    storeId: string,
    sku: string,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findByStoreAndSku(
      storeId,
      sku,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponse(product);
  }

  // -----------------------------------------
  // FIND BY STORE + SLUG
  async findByStoreAndSlug(
    storeId: string,
    slug: string,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findByStoreAndSlug(
      storeId,
      slug,
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponse(product);
  }

  // -----------------------------------------
  // FIND PRODUCTS BY STORE
  async findByStoreId(storeId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByStoreId(storeId);

    return ProductMapper.toResponseList(products);
  }

  // -----------------------------------------
  // UPDATE
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Generate a new slug when name changes.
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      product.slug = await this.generateUniqueSlug(
        updateProductDto.name,
        product.storeId,
        product.id,
      );
    }

    // Check SKU uniqueness.
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.productRepository.findByStoreAndSku(
        product.storeId,
        updateProductDto.sku,
      );

      if (existingSku && existingSku.id !== product.id) {
        throw new ConflictException('Product SKU already exists in this store');
      }
    }

    const { categoryIds, tags, ...productData } = updateProductDto;
    Object.assign(product, productData);

    const updatedProduct = await this.productRepository.save(product);

    await this.updateCategories(product.id, categoryIds);
    await this.updateTags(product.id, product.storeId, tags);

    return ProductMapper.toResponse(updatedProduct);
  }

  // -----------------------------------------
  // SOFT DELETE
  async removeProduct(id: string): Promise<{ message: string }> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.softDelete(id);

    return {
      message: 'Product deleted successfully',
    };
  }

  // -----------------------------------------
  // RESTORE
  async restoreProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findByIdWithDeleted(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.deletedAt) {
      throw new BadRequestException('Product is not deleted');
    }

    await this.productRepository.restore(id);

    const restoredProduct = await this.productRepository.findById(id);

    if (!restoredProduct) {
      throw new NotFoundException('Product could not be restored');
    }

    return ProductMapper.toResponse(restoredProduct);
  }

  // -----------------------------------------
  // PUBLISH
  async publishProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.validateProductForPublishing(product);

    await this.validateActiveStore(product.storeId);

    product.status = ProductStatus.PUBLISHED;

    product.publishedAt = new Date();

    const updatedProduct = await this.productRepository.save(product);

    return ProductMapper.toResponse(updatedProduct);
  }

  // -----------------------------------------
  // ADD PRODUCT IMAGE
  async addProductImage(
    productId: string,
    url: string,
    altText?: string,
  ): Promise<ProductImage> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const images = await this.productImageRepository.findByProductId(productId);

    const image = this.productImageRepository.create({
      productId,
      url,
      altText,
      position: images.length,
      isPrimary: images.length === 0,
    });

    return this.productImageRepository.save(image);
  }

  // -----------------------------------------
  // GET PRODUCT IMAGES
  async getProductImages(productId: string): Promise<ProductImage[]> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productImageRepository.findByProductId(productId);
  }

  // -----------------------------------------
  // SET PRIMARY PRODUCT IMAGE
  async setPrimaryProductImage(
    productId: string,
    imageId: string,
  ): Promise<ProductImage> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const image = await this.productImageRepository.findById(imageId);
    if (!image || image.productId !== productId) {
      throw new NotFoundException('Product image not found');
    }

    await this.productImageRepository.clearPrimary(productId);
    image.isPrimary = true;

    return this.productImageRepository.save(image);
  }

  // -----------------------------------------
  // REORDER PRODUCT IMAGE
  async reorderProductImage(
    productId: string,
    imageId: string,
    position: number,
  ): Promise<ProductImage> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (position < 0) {
      throw new BadRequestException('Position cannot be negative');
    }

    const image = await this.productImageRepository.findById(imageId);

    if (!image || image.productId !== productId) {
      throw new NotFoundException('Product image not found');
    }

    image.position = position;

    return this.productImageRepository.save(image);
  }

  // -----------------------------------------
  // DELETE PRODUCT IMAGE
  async deleteProductImage(
    productId: string,
    imageId: string,
  ): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const image = await this.productImageRepository.findById(imageId);
    if (!image || image.productId !== productId) {
      throw new NotFoundException('Product image not found');
    }

    await this.productImageRepository.delete(imageId);
    return {
      message: 'Product image deleted successfully',
    };
  }
}
