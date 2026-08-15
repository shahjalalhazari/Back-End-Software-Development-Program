import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTag } from '../entity/product-tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTagRepository {
  constructor(
    @InjectRepository(ProductTag)
    private readonly repository: Repository<ProductTag>,
  ) {}

  create(data: Partial<ProductTag>): ProductTag {
    return this.repository.create(data);
  }

  save(tag: ProductTag): Promise<ProductTag> {
    return this.repository.save(tag);
  }

  async findById(id: string): Promise<ProductTag | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByStoreAndName(
    storeId: string,
    name: string,
  ): Promise<ProductTag | null> {
    return this.repository.findOne({
      where: {
        storeId,
        name,
      },
    });
  }

  async findByStoreAndSlug(
    storeId: string,
    slug: string,
  ): Promise<ProductTag | null> {
    return this.repository.findOne({
      where: {
        storeId,
        slug,
      },
    });
  }

  async findByStoreId(storeId: string): Promise<ProductTag[]> {
    return this.repository.find({
      where: {
        storeId,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
