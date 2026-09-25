import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from 'src/store/entity/store.entity';

@Entity('product_tags')
@Index(['storeId', 'name'], { unique: true })
@Index(['storeId', 'slug'], { unique: true })
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  storeId: string;

  @ManyToOne(() => Store, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  name: string;

  @Column()
  slug: string;
}
