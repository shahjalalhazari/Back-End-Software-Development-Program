import { Store } from 'src/store/entity/store.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductOption } from './product-option.entity';
import { DecimalTransformer } from 'src/utils/decimal.transformer';
import { ProductCategory } from './product-category.entity';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  HIDDEN = 'HIDDEN',
}

export type ProductDimensions = {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
};

@Entity('products')
@Index(['storeId', 'slug'], { unique: true })
@Index(['storeId', 'sku'], { unique: true })
@Index(['storeId', 'status'])
@Index(['status', 'createdAt'])
@Check(`"price" >= 0`)
@Check(`"compareAtPrice" IS NULL OR "compareAtPrice" >= "price"`)
@Check(`"costPrice" IS NULL OR "costPrice" >= 0`)
@Check(`"quantity" >= 0`)
@Check(`"lowStockThreshold" >= 0`)
@Check(`"weight" IS NULL OR "weight" >= 0`)
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  storeId: string;

  @ManyToOne(() => Store, (store) => store.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ length: 200 })
  @Index()
  name: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({
    type: 'varchar',
    length: 5000,
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  shortDescription?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  @Index()
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  compareAtPrice?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  costPrice?: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  sku?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  barcode?: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  @Index()
  status: ProductStatus;

  @Column({ default: true })
  trackInventory: boolean;

  @Column({ default: false })
  allowBackorders: boolean;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'int',
    default: 10,
  })
  lowStockThreshold: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  weight?: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  dimensions?: ProductDimensions;

  @Column({ default: false })
  hasVariants: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isDigital: boolean;

  @Column({
    type: 'varchar',
    length: 70,
    nullable: true,
  })
  metaTitle?: string;

  @Column({
    type: 'varchar',
    length: 160,
    nullable: true,
  })
  metaDescription?: string;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => ProductOption, (option) => option.product, {
    cascade: true,
  })
  options: ProductOption[];

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
  )
  productCategories: ProductCategory[];

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
