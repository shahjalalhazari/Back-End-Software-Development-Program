import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum UserRole {
    SYSTEM_ADMIN = "SYSTEM_ADMIN",
    CUSTOMER = "CUSTOMER",
    VENDOR = "VENDOR",
};


@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    email: string;

    @Column()
    password: string;

    @Column({nullable: true })
    firstName: string;

    @Column( { nullable: true })
    lastName: string;

    @Column({ type: 'enum', enum: UserRole })
    @Index()
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}