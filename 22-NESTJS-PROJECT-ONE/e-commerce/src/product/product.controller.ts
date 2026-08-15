import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product-dtos/create-product.dto';
import { UpdateProductDto } from './dto/product-dtos/update-product.dto';
import { ProductResponseDto } from './dto/product-dtos/product-response.dto';
import { CreateVariantDto } from './dto/variant-dtos/create-variant.dto';
import { UpdateVariantDto } from './dto/variant-dtos/update-variant.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CREATE PRODUCT
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  // GET ALL PRODUCTS
  @Get()
  findAll(): Promise<ProductResponseDto[]> {
    return this.productService.findAll();
  }

  // GET PRODUCTS BY STORE
  @Get('store/:storeId')
  findByStoreId(
    @Param('storeId') storeId: string,
  ): Promise<ProductResponseDto[]> {
    return this.productService.findByStoreId(storeId);
  }

  // GET PRODUCT BY STORE + SKU
  @Get('store/:storeId/sku/:sku')
  findByStoreAndSku(
    @Param('storeId') storeId: string,
    @Param('sku') sku: string,
  ): Promise<ProductResponseDto> {
    return this.productService.findByStoreAndSku(storeId, sku);
  }

  // GET PRODUCT BY STORE + SLUG
  @Get('store/:storeId/slug/:slug')
  findByStoreAndSlug(
    @Param('storeId') storeId: string,
    @Param('slug') slug: string,
  ): Promise<ProductResponseDto> {
    return this.productService.findByStoreAndSlug(storeId, slug);
  }

  // GET PRODUCT BY ID
  @Get(':id')
  findById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findById(id);
  }

  // UPDATE PRODUCT
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  // PUBLISH PRODUCT
  @Post(':id/publish')
  publish(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.publishProduct(id);
  }

  // RESTORE PRODUCT
  @Post(':id/restore')
  restore(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.restoreProduct(id);
  }

  // SOFT DELETE PRODUCT
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.productService.removeProduct(id);
  }

  // ------------------------------------
  // ADD PRODUCT IMAGE
  @Post(':productId/images')
  addProductImage(
    @Param('productId') productId: string,
    @Body()
    body: {
      url: string;
      altText?: string;
    },
  ) {
    return this.productService.addProductImage(
      productId,
      body.url,
      body.altText,
    );
  }

  // GET PRODUCT IMAGES
  @Get(':productId/images')
  getProductImages(@Param('productId') productId: string) {
    return this.productService.getProductImages(productId);
  }

  // UPDATE PRIMARY IMAGE
  @Patch(':productId/images/:imageId/primary')
  setPrimaryProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productService.setPrimaryProductImage(productId, imageId);
  }

  // REORDER PRODUCT IMAGES
  @Patch(':productId/images/:imageId/position')
  reorderProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
    @Body('position') position: number,
  ) {
    return this.productService.reorderProductImage(
      productId,
      imageId,
      position,
    );
  }

  // DELETE PRODUCT IMAGE
  @Delete(':productId/images/:imageId')
  deleteProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productService.deleteProductImage(productId, imageId);
  }

  // ----------------------------------------
  @Post(':productId/variants')
  createVariant(
    @Param('productId') productId: string,
    @Body() dto: CreateVariantDto,
  ) {
    return this.productService.createVariant(productId, dto);
  }

  @Get(':productId/variants')
  getProductVariants(@Param('productId') productId: string) {
    return this.productService.getProductVariants(productId);
  }

  @Get(':productId/variants/:variantId')
  getVariantById(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productService.getVariantById(productId, variantId);
  }

  @Patch(':productId/variants/:variantId')
  updateVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.productService.updateVariant(productId, variantId, dto);
  }

  @Delete(':productId/variants/:variantId')
  deleteVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productService.deleteVariant(productId, variantId);
  }
}
