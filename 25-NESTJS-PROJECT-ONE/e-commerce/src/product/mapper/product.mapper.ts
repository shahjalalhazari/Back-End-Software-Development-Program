import { Injectable } from '@nestjs/common';
import { ProductResponseDto } from '../dto/product-dtos/product-response.dto';
import { Product } from '../entity/product.entity';

@Injectable()
export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      storeId: product.storeId,

      name: product.name,
      slug: product.slug,

      description: product.description,
      shortDescription: product.shortDescription,

      price: product.price,
      compareAtPrice: product.compareAtPrice,
      costPrice: product.costPrice,

      sku: product.sku,
      barcode: product.barcode,

      status: product.status,

      trackInventory: product.trackInventory,
      allowBackorders: product.allowBackorders,

      quantity: product.quantity,
      lowStockThreshold: product.lowStockThreshold,

      weight: product.weight,
      dimensions: product.dimensions,

      hasVariants: product.hasVariants,
      isFeatured: product.isFeatured,
      isDigital: product.isDigital,

      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,

      publishedAt: product.publishedAt,

      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      deletedAt: product.deletedAt,
    };
  }

  static toResponseList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
