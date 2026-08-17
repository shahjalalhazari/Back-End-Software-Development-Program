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

  // ASSIGN TAG TO PRODUCT
  async create(
    productId: string,
    tagId: string,
  ): Promise<ProductTagAssignment> {
    const assignment = this.repository.create({
      productId,
      tagId,
    });

    return this.repository.save(assignment);
  }

  // ASSINGN MULTIPLE TAGS TO A PRODUCT
  async createMany(
    productId: string,
    tagIds: string[],
  ): Promise<ProductTagAssignment[]> {
    if (!tagIds.length) {
      return [];
    }

    const assignments = tagIds.map((tagId) =>
      this.repository.create({
        productId,
        tagId,
      }),
    );

    return this.repository.save(assignments);
  }

  // GET ALL TAG ASSIGNMENTS FOR A PRODUCT
  async findByProductId(productId: string): Promise<ProductTagAssignment[]> {
    return this.repository.find({
      where: { productId },
      relations: { tag: true },
    });
  }

  // GET ALL PRODUCTS USING A TAG
  async findByTagId(tagId: string): Promise<ProductTagAssignment[]> {
    return this.repository.find({
      where: { tagId },
    });
  }

  // CHECK TAG IS ALREADY ASSIGNED TO A PRODUCT
  async exists(productId: string, tagId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        productId,
        tagId,
      },
    });

    return count > 0;
  }

  // REMOVE A TAG FROM PRODUCT
  async remove(productId: string, tagId: string): Promise<void> {
    await this.repository.delete({
      productId,
      tagId,
    });
  }

  // REMOVE ALL TAGS FROM A PRODUCT
  async removeAllByProductId(productId: string): Promise<void> {
    await this.repository.delete({ productId });
  }

  // REPLACE ALL TAGS ASSIGNED TO A PRODUCT
  async replace(
    productId: string,
    tagIds: string[],
  ): Promise<ProductTagAssignment[]> {
    await this.removeAllByProductId(productId);

    if (!tagIds.length) {
      return [];
    }

    return this.createMany(productId, tagIds);
  }
}
