import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from './entity/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private async getCategoryEntityById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async generateUniqueSlug(baseValue: string): Promise<string> {
    const baseSlug = this.slugify(baseValue);
    let slug = baseSlug;
    let suffix = 1;

    while (await this.categoryRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = await this.generateUniqueSlug(
      createCategoryDto.slug ?? createCategoryDto.name,
    );

    const category = await this.categoryRepository.create({
      ...createCategoryDto,
      slug,
      isActive: createCategoryDto.isActive ?? true,
    });

    return category;
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findAllActive(): Promise<Category[]> {
    return this.categoryRepository.findAllActive();
  }

  async findById(id: string): Promise<Category> {
    return this.getCategoryEntityById(id);
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryEntityById(id);

    if (updateCategoryDto.slug) {
      const slug = this.slugify(updateCategoryDto.slug);
      const existingCategory = await this.categoryRepository.findBySlug(slug);
      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `Category with slug '${slug}' already exists`,
        );
      }
      category.slug = slug;
    }

    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }

    if (updateCategoryDto.isActive !== undefined) {
      category.isActive = updateCategoryDto.isActive;
    }

    return this.categoryRepository.update(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.getCategoryEntityById(id);
    await this.categoryRepository.remove(category);
  }
}
