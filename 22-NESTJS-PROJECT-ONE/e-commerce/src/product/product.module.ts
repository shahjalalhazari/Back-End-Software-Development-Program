import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entity/product.entity';
import { ProductRepository } from './repository/product.repository';
import { StoreModule } from '../store/store.module';
import { ProductImage } from './entity/product-image.entity';
import { ProductVariant } from './entity/product-variant.entity';
import { ProductOption } from './entity/product-option.entity';
import { ProductCategory } from './entity/product-category.entity';
import { ProductTag } from './entity/product-tag.entity';
import { ProductTagAssignment } from './entity/product-tag-assignment.entity';
import { ProductCategoryRepository } from './repository/product-category.repository';
import { ProductTagRepository } from './repository/product-tag.repository';
import { ProductTagAssignmentRepository } from './repository/product-tag-assignment.repository';
import { ProductImageRepository } from './repository/product-image.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductVariant,
      ProductOption,
      ProductCategory,
      ProductTag,
      ProductTagAssignment,
    ]),
    StoreModule,
  ],
  providers: [
    ProductService,
    ProductRepository,
    ProductCategoryRepository,
    ProductTagRepository,
    ProductTagAssignmentRepository,
    ProductImageRepository,
  ],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
