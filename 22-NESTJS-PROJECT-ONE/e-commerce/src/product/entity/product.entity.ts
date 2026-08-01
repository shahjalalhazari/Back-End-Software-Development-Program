import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  HIDDEN = 'HIDDEN',
}


@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column()
  @Index()
  name: string;


  @Column({ type: 'text' })
  description: string;


  @Column({ unique: true })
  @Index()
  sku: string;


  @Column({ unique: true, nullable: true })
  slug?: string;


  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;


  @Column({
    type: 'decimal',
    nullable: true,
  })
  compareAtPrice?: number;


  @Column({ default: true })
  trackInventory: boolean;


  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;


  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;


  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedAt?: Date;


  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;


  @DeleteDateColumn()
  deletedAt?: Date;
}