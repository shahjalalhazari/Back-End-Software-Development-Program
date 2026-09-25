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

  // CREATE NEW PRODUCT TAG
  async create(
    storeId: string,
    name: string,
    slug: string,
  ): Promise<ProductTag> {
    const tag = this.repository.create({
      storeId,
      name,
      slug,
    });

    return this.repository.save(tag);
  }

  // FIND TAG BY ID
  async findById(id: string): Promise<ProductTag | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  // FIND TAG BY STORE AND SLUG
  async findByStoreAndSlug(
    storeId: string,
    slug: string,
  ): Promise<ProductTag | null> {
    return this.repository.findOne({
      where: { storeId, slug },
    });
  }

  // FIND TAG BY STORE AND NAME
  async findByStoreAndName(
    storeId: string,
    name: string,
  ): Promise<ProductTag | null> {
    return this.repository.findOne({
      where: { storeId, name },
    });
  }

  // FIND ALL TAGS BELONGS TO A STORE
  async findByStoreId(storeId: string): Promise<ProductTag[]> {
    return this.repository.find({
      where: { storeId },
      order: { name: 'ASC' },
    });
  }

  // FIND MULTIPLE TAGS BY THEIR IDs
  async findByIds(ids: string[]): Promise<ProductTag[]> {
    if (!ids.length) {
      return [];
    }

    return this.repository
      .createQueryBuilder('tag')
      .where('tag.id IN (:...ids)', { ids })
      .getMany();
  }

  // CHECK WHETHER A TAG EXISTS IN A STORE
  async exists(storeId: string, tagId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id: tagId, storeId },
    });

    return count > 0;
  }

  // UPDATE TAG
  async update(id: string, data: Partial<ProductTag>): Promise<void> {
    await this.repository.update(id, data);
  }

  // DELETE TAG
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
