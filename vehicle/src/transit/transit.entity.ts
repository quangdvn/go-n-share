import { TripShift, TripStatus } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Cab } from '../cab/cab.entity';

@Entity({ name: 'transits' })
export class Transit extends BaseEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  departureDate: string;

  @Column({ type: 'enum', enum: TripShift })
  departureShift: TripShift;

  @Column({ type: 'enum', enum: TripStatus, default: TripStatus.UNCONFIRM })
  transitStatus: TripStatus;

  @ManyToOne(() => Cab, (cab) => cab.transits, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'cabId' })
  cab: Cab;

  @Column()
  cabId: number;

  @Column()
  tripId: number;
}
