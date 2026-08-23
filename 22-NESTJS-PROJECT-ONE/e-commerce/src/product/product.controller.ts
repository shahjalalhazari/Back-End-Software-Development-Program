import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product-dtos/create-product.dto';
import { UpdateProductDto } from './dto/product-dtos/update-product.dto';
import { ProductResponseDto } from './dto/product-dtos/product-response.dto';
import { CreateVariantDto } from './dto/variant-dtos/create-variant.dto';
import { UpdateVariantDto } from './dto/variant-dtos/update-variant.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-user.interface';
import { ProductQueryDto } from './dto/product-query-dto/product-query.dto';
import { UpdateInventoryDto } from './dto/inventory-dtos/update-inventory.dto';
import { CreateProductOptionDto } from './dto/product-option/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/product-option/update-product-option.dto';
import { AddProductImageDto } from './dto/product-image-dtos/add-product-image.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // -----------------------------------------
  // PRODUCTS
  // -----------------------------------------

  // CREATE PRODUCT
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto, req.user);
  }

  // GET ALL PRODUCTS
  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  // GET PRODUCT BY ID
  @Get(':id')
  findById(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findById(id);
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

  // GET PRODUCTS BY STORE
  @Get('store/:storeId')
  findByStoreId(
    @Param('storeId') storeId: string,
  ): Promise<ProductResponseDto[]> {
    return this.productService.findByStoreId(storeId);
  }

  // UPDATE PRODUCT
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(id, updateProductDto, req.user);
  }

  // SOFT DELETE PRODUCT
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    return this.productService.removeProduct(id, req.user);
  }

  // RESTORE PRODUCT
  @Post(':id/restore')
  restore(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.restoreProduct(id);
  }

  // PUBLISH PRODUCT
  @Post(':id/publish')
  publish(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.publishProduct(id, req.user);
  }

  // HIDE PRODUCT
  @Post(':id/hide')
  hide(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.hideProduct(id, req.user);
  }

  // UNHIDE PRODUCT
  @Post(':id/unhide')
  unhide(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.unhideProduct(id, req.user);
  }

  // ARCHIVE PRODUCT
  @Post(':id/archive')
  archive(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.archiveProduct(id, req.user);
  }

  // RESTORE ARCHIVE PRODUCT
  @Post(':id/restoreAchive')
  restoreArchive(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProductResponseDto> {
    return this.productService.restoreArchivedProduct(id, req.user);
  }

  // GET PUBLIC PRODUCT BY SLUG
  @Get('slug/:slug')
  findPublishedBySlug(@Param('slug') slug: string) {
    return this.productService.findPublishedBySlug(slug);
  }

  // -----------------------------------------
  // PRODUCT IMAGES
  // -----------------------------------------

  // ADD PRODUCT IMAGE
  @Post(':productId/images')
  addProductImage(
    @Param('productId') productId: string,
    @Body() dto: AddProductImageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.addProductImage(
      productId,
      dto.url,
      dto.altText,
      req.user,
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
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.setPrimaryProductImage(
      productId,
      imageId,
      req.user,
    );
  }

  // REORDER PRODUCT IMAGES
  @Patch(':productId/images/:imageId/position')
  reorderProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
    @Body('position') position: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.reorderProductImage(
      productId,
      imageId,
      position,
      req.user,
    );
  }

  // DELETE PRODUCT IMAGE
  @Delete(':productId/images/:imageId')
  deleteProductImage(
    @Param('productId') productId: string,
    @Param('imageId') imageId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.deleteProductImage(productId, imageId, req.user);
  }

  // -----------------------------------------
  // PRODUCT VAIRANTS
  // -----------------------------------------

  // ADD VARINAT
  @Post(':productId/variants')
  createVariant(
    @Param('productId') productId: string,
    @Body() dto: CreateVariantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.createVariant(productId, dto, req.user);
  }

  // GENERATE VARIANT
  @Post(':productId/variants/generate')
  generateVariants(
    @Param('productId') productId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.generateVariants(productId, req.user);
  }

  // GET ALL VARIANTS
  @Get(':productId/variants')
  getProductVariants(@Param('productId') productId: string) {
    return this.productService.getProductVariants(productId);
  }

  // GET SINGLE VARIANT
  @Get(':productId/variants/:variantId')
  getVariantById(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.productService.getVariantById(productId, variantId);
  }

  // UPDATE VARIANT
  @Patch(':productId/variants/:variantId')
  updateVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.updateVariant(
      productId,
      variantId,
      dto,
      req.user,
    );
  }

  // DELETE VARIANT
  @Delete(':productId/variants/:variantId')
  deleteVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.deleteVariant(productId, variantId, req.user);
  }

  // -----------------------------------------
  // PRODUCT INVENTORY
  // -----------------------------------------

  // GET INVENTORY
  @Get(':id/inventory')
  getProductInventory(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.getProductInventory(id, req.user);
  }

  // UDPATE INVENTORY
  @Patch(':id/inventory')
  updateProductInventory(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.updateProductInventory(id, dto, req.user);
  }

  // -----------------------------------------
  // PRODUCT VARIANT OPTIONS
  // -----------------------------------------

  // ADD OPTION
  @Post(':productId/options')
  createProductOption(
    @Param('productId') productId: string,
    @Body() dto: CreateProductOptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.createProductOption(productId, dto, req.user);
  }

  // GET OPTIONS
  @Get(':productId/options')
  getProductOptions(@Param('productId') productId: string) {
    return this.productService.getProductOptions(productId);
  }

  // UPDATE OPTION
  @Patch(':productId/options/:optionId')
  updateProductOption(
    @Param('productId') productId: string,
    @Param('optionId') optionId: string,
    @Body() dto: UpdateProductOptionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.updateProductOption(
      productId,
      optionId,
      dto,
      req.user,
    );
  }

  // DELETE OPTION
  @Delete(':productId/options/:optionId')
  deleteProductOption(
    @Param('productId') productId: string,
    @Param('optionId') optionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.productService.deleteProductOption(
      productId,
      optionId,
      req.user,
    );
  }
}
