import { TripShift, TripStatus } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique([
  'departureDate',
  'departureTime',
  'arriveDate',
  'arriveTime',
  'coachId',
  'driverId',
])
@Entity({ name: 'trips' })
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  departureDate: string;

  @Column({ type: 'enum', enum: TripShift })
  departureTime: TripShift;

  @Column()
  arriveDate: string;

  @Column()
  arriveTime: TripShift;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.UNCONFIRM })
  tripStatus: TripStatus;

  @Column()
  coachId: number;

  @Column()
  driverId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
