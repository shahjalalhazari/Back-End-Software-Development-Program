import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTagAssignment } from '../entity/product-tag-assignment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTagAssignmentRepository {
  constructor(
    @InjectRepository(ProductTagAssignment)
    private readonly repository: Repository<ProductTagAssignment>,
  ) {}

  async create(
    productId: string,
    tagId: string,
  ): Promise<ProductTagAssignment> {
    const assignment = this.repository.create({ productId, tagId });

    return this.repository.save(assignment);
  }

  async createMany(
    productId: string,
    tagIds: string[],
  ): Promise<ProductTagAssignment[]> {
    if (!tagIds.length) {
      return [];
    }

    const records = tagIds.map((tagId) =>
      this.repository.create({
        productId,
        tagId,
      }),
    );

    return this.repository.save(records);
  }

  async findByProductId(productId: string): Promise<ProductTagAssignment[]> {
    return this.repository.find({
      where: { productId },
      relations: { tag: true },
    });
  }

  async findByProductAndTag(
    productId: string,
    tagId: string,
  ): Promise<ProductTagAssignment | null> {
    return this.repository.findOne({
      where: {
        productId,
        tagId,
      },
    });
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.repository.delete({
      productId,
    });
  }

  async deleteByProductAndTag(productId: string, tagId: string): Promise<void> {
    await this.repository.delete({
      productId,
      tagId,
    });
  }
}
