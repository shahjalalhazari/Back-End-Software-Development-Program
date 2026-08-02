import { ProductResponseDto } from "../dto/product-response.dto";
import { Product } from "../entity/product.entity";

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    return {
      id: product.id,
      storeId: product.storeId,
      name: product.name,
      description: product.description,
      sku: product.sku,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      trackInventory: product.trackInventory,
      stock: product.stock,
      status: product.status,
      publishedAt: product.publishedAt,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toResponseList(products: Product[]): ProductResponseDto[]{
    return products.map(product => this.toResponse(product));
  }
}