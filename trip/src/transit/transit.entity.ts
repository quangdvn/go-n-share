import { TripShift, TripStatus } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Trip } from '../trip/trip.entity';
import { TransitDetail } from './transit-detail.entity';

@Unique(['departureDate', 'departureShift', 'cabId', 'driverId', 'tripId'])
@Entity({ name: 'transits' })
export class Transit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  departureDate: string;

  @Column({ type: 'enum', enum: TripShift })
  departureShift: TripShift;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.UNCONFIRM })
  transitStatus: TripStatus;

  @Column()
  cabId: number;

  @Column()
  driverId: number;

  @OneToOne(() => Trip, (trip) => trip.transit)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: number;

  @OneToMany(() => TransitDetail, (detail) => detail.transit)
  details: TransitDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
