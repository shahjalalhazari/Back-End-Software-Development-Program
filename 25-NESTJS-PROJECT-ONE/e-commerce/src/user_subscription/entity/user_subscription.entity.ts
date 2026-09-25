
import { Subscription, SubscriptionStatus } from 'src/subscription/entity/subscription.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  subscriptionId: string;

  @ManyToOne(() => Subscription, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  @Index()
  status: SubscriptionStatus;

  @Column({ default: false })
  autoRenew: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Column({
    type: 'timestamp',
  })
  endDate: Date;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  paymentId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}