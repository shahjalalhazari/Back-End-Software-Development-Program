import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StoreStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED',
}

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid'})
  @Index()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId'})
  user: User;

  @Column({ length: 100 })
  @Index()
  name: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({
    type: 'enum',
    enum: StoreStatus,
    default: StoreStatus.PENDING_APPROVAL,
  })
  @Index()
  status: StoreStatus;


  @Column({ length: 255 })
  storeEmail: string;

  @Column({ length: 15, nullable: true })
  storePhoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
