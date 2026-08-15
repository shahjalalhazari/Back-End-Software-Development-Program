import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';
import { Product } from './product.entity';
import { Category } from 'src/category/entity/category.entity';

@Entity('product_categories')
@Index(['productId', 'categoryId'], { unique: true })
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  productId: string;

  @Column('uuid')
  @Index()
  categoryId: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
