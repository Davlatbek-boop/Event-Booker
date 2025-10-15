import { on } from 'events';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CREATOR = 'creator',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  refresh_token: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: '' })
  activation_link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
