import { ProductStatus } from "../entity/product.entity";

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  sku: string;
  slug?: string;
  price: number;
  compareAtPrice?: number;
  trackInventory: boolean;
  stock: number;
  status: ProductStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<ProductResponseDto>){
    Object.assign(this, partial);
  }
}