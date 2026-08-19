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

  @Column({ length: 200 })
  name:string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode: string | null;

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
  compareAtPrice: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  costPrice: number | null;

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
  weight: number | null;

  @Column()
  option1: string;

  @Column({ type: 'varchar', nullable: true })
  option2: string | null;

  @Column({ type: 'varchar', nullable: true })
  option3: string | null;

  @Column('uuid', { nullable: true })
  imageId: string | null;

  @ManyToOne(() => ProductImage, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'imageId' })
  image: ProductImage | null;

  @Column({ default: 0 })
  position: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
