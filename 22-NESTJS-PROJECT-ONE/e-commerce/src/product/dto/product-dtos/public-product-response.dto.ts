import { ProductStatus } from 'src/product/entity/product.entity';

export class PublicProductImageDto {
  id: string;
  url: string;
  altText?: string;
  position: number;
  isPrimary: boolean;
}

export class PublicProductVariantDto {
  id: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;

  option1?: string;
  option2?: string;
  option3?: string;

  imageId?: string;
}

export class PublicProductCategoryDto {
  id: string;
  name: string;
  slug: string;
}

export class PublicProductResponseDto {
  id: string;
  name: string;
  slug?: string;

  description?: string;
  shortDescription?: string;

  price: number;
  compareAtPrice?: number;

  status: ProductStatus;

  trackInventory: boolean;
  quantity: number;

  isDigital: boolean;

  images: PublicProductImageDto[];
  variants: PublicProductVariantDto[];
  categories: PublicProductCategoryDto[];

  publishedAt?: Date | null;
}
