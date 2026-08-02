import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entity/product.entity';
import { ProductRepository } from './repository/product.repository';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), StoreModule],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
