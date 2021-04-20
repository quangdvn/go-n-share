import { Location, TripShift, TripStatus } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Transit } from '../transit/transit.entity';

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

  @Column({ type: 'enum', enum: Location })
  departureLocation: Location;

  @Column()
  arriveDate: string;

  @Column()
  arriveTime: TripShift;

  @Column({ type: 'enum', enum: Location })
  arriveLocation: Location;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.UNCONFIRM })
  tripStatus: TripStatus;

  @Column()
  coachId: number;

  @Column()
  driverId: number;

  @OneToOne(() => Transit, (transit) => transit.trip)
  transit: Transit;

  @Column({ type: 'int', default: 0 })
  bookedSeat: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
