import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { DecimalTransformer } from 'src/utils/decimal.transformer';
import { ProductImage } from './product-image.entity';

@Entity('product_variants')
@Index(['storeId', 'sku'], { unique: true })
@Check(`"quantity" >= 0`)
@Check(`
  "compareAtPrice" IS NULL 
  OR "compareAtPrice" >= "price"
`)
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  storeId:string;

  @Column('uuid')
  @Index()
  productId: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  name:string;

  @Column({ nullable: true })
  sku?: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
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
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  weight?: number;

  @Column()
  option1: string;

  @Column({ nullable: true })
  option2?: string;

  @Column({ nullable: true })
  option3?: string;

  @Column('uuid', { nullable: true })
  imageId?: string;

  @ManyToOne(() => ProductImage, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'imageId' })
  image?: ProductImage;

  @Column({ default:0 })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}