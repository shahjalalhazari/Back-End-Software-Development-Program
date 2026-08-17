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
import { ProductVariantRepository } from './repository/product-variant.repository';
import { CreateVariantDto } from './dto/variant-dtos/create-variant.dto';
import { ProductVariant } from './entity/product-variant.entity';
import { UpdateVariantDto } from './dto/variant-dtos/update-variant.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly storeService: StoreService,
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly productTagRepository: ProductTagRepository,
    private readonly productTagAssignmentRepository: ProductTagAssignmentRepository,
    private readonly productImageRepository: ProductImageRepository,
    private readonly productVariantRepository: ProductVariantRepository,
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

        tag = await this.productTagRepository.create(storeId, tagName, slug);
      }

      await this.productTagAssignmentRepository.create(productId, tag.id);
    }
  }

  // UPDATE CATEGORIES
  private async updateCategories(
    productId: string,
    categoryIds?: string[],
  ): Promise<void> {
    if (categoryIds === undefined) {
      return;
    }

    await this.productCategoryRepository.removeAllByProductId(productId);

    if (categoryIds.length === 0) {
      return;
    }

    const uniqueCategoryIds = [...new Set(categoryIds)];

    await this.productCategoryRepository.createMany(
      productId,
      uniqueCategoryIds,
    );
  }

  // UPDATE TAGS
  private async updateTags(
    productId: string,
    storeId: string,
    tags: string[] | undefined,
  ): Promise<void> {
    if (tags === undefined) {
      return;
    }

    await this.productTagAssignmentRepository.removeAllByProductId(productId);

    if (tags.length === 0) {
      return;
    }

    await this.assignTags(productId, storeId, tags);
  }

  // VALIDATE PRODUCT FOR PUBLISH
  private validateBasicProductInformation(product: Product): void {
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

    if (!product.slug?.trim()) {
      throw new BadRequestException(
        'Product slug is required before publishing',
      );
    }
  }

  // VALIDATE PRODUCT PRICING
  private validateProductPricing(product: Product): void {
    if (
      product.price === undefined ||
      product.price === null ||
      product.price < 0
    ) {
      throw new BadRequestException(
        'Product price must be a valid non-negative number',
      );
    }

    if (
      product.compareAtPrice !== undefined &&
      product.compareAtPrice !== null &&
      product.compareAtPrice < product.price
    ) {
      throw new BadRequestException(
        'Compare-at price must be greater than or equal to price',
      );
    }

    if (
      product.costPrice !== undefined &&
      product.costPrice !== null &&
      product.costPrice < 0
    ) {
      throw new BadRequestException('Cost price cannot be negative');
    }
  }

  // VALIDATE PRODUCT INVENTORY
  private validateProductInventory(product: Product): void {
    if (product.quantity < 0) {
      throw new BadRequestException('Product quantity cannot be negative');
    }

    if (product.lowStockThreshold < 0) {
      throw new BadRequestException('Low stock threshold cannot be negative');
    }
  }

  // VALIDATE PRODUCT CATEGORIES
  private async validateProductCategories(productId: string): Promise<void> {
    const categories =
      await this.productCategoryRepository.findByProductId(productId);

    if (!categories.length) {
      throw new BadRequestException(
        'At least one category is required before publishing',
      );
    }
  }

  // VALIDATE PRODUCT IMAGES
  private async validateProductImages(productId: string): Promise<void> {
    const images = await this.productImageRepository.findByProductId(productId);

    if (!images.length) {
      throw new BadRequestException(
        'At least one product image is required before publishing',
      );
    }

    const hasPrimaryImage = images.some((image) => image.isPrimary);

    if (!hasPrimaryImage) {
      throw new BadRequestException(
        'Product must have a primary image before publishing',
      );
    }
  }

  // VALIDATE PRODUCT VARIANTS
  private async validateProductVariants(productId: string): Promise<void> {
    const variants =
      await this.productVariantRepository.findByProductId(productId);

    if (!variants.length) {
      return;
    }

    for (const variant of variants) {
      if (!variant.name?.trim()) {
        throw new BadRequestException('Every product variant must have a name');
      }

      if (
        variant.price === undefined ||
        variant.price === null ||
        variant.price < 0
      ) {
        throw new BadRequestException(
          `Variant "${variant.name}" must have a valid price`,
        );
      }

      if (
        variant.compareAtPrice !== undefined &&
        variant.compareAtPrice !== null &&
        variant.compareAtPrice < variant.price
      ) {
        throw new BadRequestException(
          `Variant "${variant.name}" has an invalid compare-at price`,
        );
      }

      if (variant.quantity < 0) {
        throw new BadRequestException(
          `Variant "${variant.name}" has invalid quantity`,
        );
      }
    }
  }

  // VALIDATE PRODUCT FOR PUBLISHING
  private async validateProductForPublishing(product: Product): Promise<void> {
    this.validateBasicProductInformation(product);

    this.validateProductPricing(product);

    this.validateProductInventory(product);

    await this.validateProductCategories(product.id);

    await this.validateProductImages(product.id);

    await this.validateProductVariants(product.id);
  }

  // -----------------------------------------

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

  // FIND ALL
  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();

    return ProductMapper.toResponseList(products);
  }

  // FIND BY ID
  async findById(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponse(product);
  }

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

  // FIND PRODUCTS BY STORE
  async findByStoreId(storeId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findByStoreId(storeId);

    return ProductMapper.toResponseList(products);
  }

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

  // PUBLISH
  async publishProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      product.status !== ProductStatus.DRAFT &&
      product.status !== ProductStatus.HIDDEN
    ) {
      throw new BadRequestException(
        'Only draft or hidden products can be published',
      );
    }

    await this.validateProductForPublishing(product);
    await this.validateActiveStore(product.storeId);

    product.status = ProductStatus.PUBLISHED;
    product.publishedAt = new Date();
    const updatedProduct = await this.productRepository.save(product);

    return ProductMapper.toResponse(updatedProduct);
  }

  // HIDE PRODUCT
  async hideProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.PUBLISHED) {
      throw new BadRequestException('Only published products can be hidden');
    }

    product.status = ProductStatus.HIDDEN;
    const updatedProduct = await this.productRepository.save(product);

    return ProductMapper.toResponse(updatedProduct);
  }

  // UNHIDE PRODUCT
  async unhideProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.HIDDEN) {
      throw new BadRequestException('Only hidden products can be unhidden');
    }

    await this.validateActiveStore(product.storeId);
    product.status = ProductStatus.PUBLISHED;
    const updatedProduct = await this.productRepository.save(product);

    return ProductMapper.toResponse(updatedProduct);
  }

  // ARCHIVE PRODUCT
  async archiveProduct(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      product.status !== ProductStatus.PUBLISHED &&
      product.status !== ProductStatus.HIDDEN
    ) {
      throw new BadRequestException(
        'Only published or hidden products can be archived',
      );
    }

    product.status = ProductStatus.ARCHIVED;
    const updatedProduct = await this.productRepository.save(product);

    return ProductMapper.toResponse(updatedProduct);
  }
  // -----------------------------------------

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

  // GET PRODUCT IMAGES
  async getProductImages(productId: string): Promise<ProductImage[]> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productImageRepository.findByProductId(productId);
  }

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
  // -----------------------------------------

  // -----------------------------------------
  // CREATE PRODUCT VARIENT
  async createVariant(
    productId: string,
    dto: CreateVariantDto,
  ): Promise<ProductVariant> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.compareAtPrice !== undefined && dto.compareAtPrice < dto.price) {
      throw new BadRequestException(
        'Compare price must be greater than or equal to price',
      );
    }

    if (dto.sku) {
      const existingVariant =
        await this.productVariantRepository.findByStoreAndSku(
          product.storeId,
          dto.sku,
        );

      if (existingVariant) {
        throw new ConflictException('Variant SKU already exists in this store');
      }
    }

    if (dto.imageId) {
      const image = await this.productImageRepository.findById(dto.imageId);

      if (!image || image.productId !== productId) {
        throw new BadRequestException('Image does not belong to this product');
      }
    }

    const variants =
      await this.productVariantRepository.findByProductId(productId);

    const name = [dto.option1, dto.option2, dto.option3]
      .filter(Boolean)
      .join(' / ');

    const variant = this.productVariantRepository.create({
      storeId: product.storeId,
      productId,
      name,
      sku: dto.sku,
      barcode: dto.barcode,
      price: dto.price,
      compareAtPrice: dto.compareAtPrice,
      costPrice: dto.costPrice,
      quantity: dto.quantity ?? 0,
      weight: dto.weight,
      option1: dto.option1,
      option2: dto.option2,
      option3: dto.option3,
      imageId: dto.imageId,
      position: variants.length,
    });

    return this.productVariantRepository.save(variant);
  }

  // GET PRODUCT VARIENT
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productVariantRepository.findByProductId(productId);
  }

  // GET PRODUCT VARIENT BY ID
  async getVariantById(
    productId: string,
    variantId: string,
  ): Promise<ProductVariant> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = await this.productVariantRepository.findById(variantId);

    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Product variant not found');
    }

    return variant;
  }

  // UPDATE PRODUCT VARIENT
  async updateVariant(
    productId: string,
    variantId: string,
    dto: UpdateVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.getVariantById(productId, variantId);

    if (
      dto.compareAtPrice !== undefined &&
      dto.price !== undefined &&
      dto.compareAtPrice < dto.price
    ) {
      throw new BadRequestException(
        'Compare price must be greater than or equal to price',
      );
    }

    if (
      dto.compareAtPrice !== undefined &&
      dto.price === undefined &&
      variant.compareAtPrice !== undefined &&
      dto.compareAtPrice < variant.price
    ) {
      throw new BadRequestException(
        'Compare price must be greater than or equal to price',
      );
    }

    if (
      dto.price !== undefined &&
      dto.compareAtPrice === undefined &&
      variant.compareAtPrice !== undefined &&
      variant.compareAtPrice < dto.price
    ) {
      throw new BadRequestException(
        'Compare price must be greater than or equal to price',
      );
    }

    if (dto.sku && dto.sku !== variant.sku) {
      const existingVariant =
        await this.productVariantRepository.findByStoreAndSku(
          variant.storeId,
          dto.sku,
        );

      if (existingVariant && existingVariant.id !== variantId) {
        throw new ConflictException('Variant SKU already exists in this store');
      }
    }

    if (dto.imageId) {
      const image = await this.productImageRepository.findById(dto.imageId);

      if (!image || image.productId !== productId) {
        throw new BadRequestException('Image does not belong to this product');
      }
    }

    Object.assign(variant, dto);

    const nextOption1 = dto.option1 ?? variant.option1;
    const nextOption2 = dto.option2 ?? variant.option2;
    const nextOption3 = dto.option3 ?? variant.option3;

    variant.name = [nextOption1, nextOption2, nextOption3]
      .filter(Boolean)
      .join(' / ');

    return this.productVariantRepository.save(variant);
  }

  // DELETE PRODUCT VARIENT
  async deleteVariant(
    productId: string,
    variantId: string,
  ): Promise<{ message: string }> {
    await this.getVariantById(productId, variantId);

    await this.productVariantRepository.delete(variantId);

    return {
      message: 'Product variant deleted successfully',
    };
  }
  // -----------------------------------------
}
