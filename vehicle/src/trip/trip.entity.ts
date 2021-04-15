import { Location, TripShift, TripStatus } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Coach } from '../coach/coach.entity';

@Entity({ name: 'trips' })
export class Trip extends BaseEntity {
  @PrimaryColumn()
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

  @ManyToOne(() => Coach, (coach) => coach.trips, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'coachId' })
  coach: Coach;

  @Column()
  coachId: number;
}
