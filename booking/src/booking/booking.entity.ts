import { BookingStatus, PaymentMethod } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'bookings' })
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookingName!: string;

  @Column()
  bookingMail!: string;

  @Column()
  bookingPhone!: string;

  @Column({ type: 'int' })
  totalPrice!: number;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ default: false })
  isCancel: boolean;

  @Column({ default: false })
  hasTransit!: boolean;

  @Column({ type: 'int', nullable: true, default: null })
  transitDetailId: number;

  @Column({ type: 'text', nullable: true, default: null })
  notes: string;

  @Column({ type: 'int' })
  tripId!: number;

  @Column({ type: 'enum', enum: BookingStatus })
  bookingStatus: BookingStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
