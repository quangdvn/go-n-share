import { BookingStatus, TransitDetailEnum } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Transit } from './transit.entity';

@Entity({ name: 'transitDetails' })
export class TransitDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookingName!: string;

  @Column()
  bookingPhone!: string;

  @Column({ type: 'enum', enum: BookingStatus })
  bookingStatus: BookingStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @ManyToOne(() => Transit, (transit) => transit.details)
  @JoinColumn({ name: 'transitId' })
  transit: Transit;

  @Column()
  transitId: number;

  @Column({ default: false })
  isVerify: boolean;

  @Column({ default: false })
  isCancel: boolean;

  @Column({
    type: 'enum',
    enum: TransitDetailEnum,
    default: TransitDetailEnum.READY,
  })
  transitStatus: TransitDetailEnum;
}
