import {
  ProductDimensions,
  ProductStatus,
} from 'src/product/entity/product.entity';

export class ProductResponseDto {
  id: string;
  storeId: string;

  name: string;
  slug?: string;

  description?: string;
  shortDescription?: string;

  price: number;
  compareAtPrice?: number;
  costPrice?: number;

  sku?: string;
  barcode?: string;

  status: ProductStatus;

  trackInventory: boolean;
  allowBackorders: boolean;

  quantity: number;
  lowStockThreshold: number;

  weight?: number;
  dimensions?: ProductDimensions;

  hasVariants: boolean;
  isFeatured: boolean;
  isDigital: boolean;

  metaTitle?: string;
  metaDescription?: string;

  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
