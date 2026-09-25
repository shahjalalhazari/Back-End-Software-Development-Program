import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController, AdminCategoryController } from './category.controller';
import { Category } from './entity/category.entity';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController, AdminCategoryController],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
