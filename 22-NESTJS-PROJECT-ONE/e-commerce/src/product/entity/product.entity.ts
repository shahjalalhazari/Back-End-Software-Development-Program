import { Store } from 'src/store/entity/store.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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
  storeId: string;

  @ManyToOne(() => Store, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  @Index()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true })
  @Index()
  sku: string;

  @Column({ unique: true, nullable: true })
  @Index()
  slug?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    }
  })
  @Index()
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    }
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
  @Index()
  status: ProductStatus;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedAt?: Date;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}