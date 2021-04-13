import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../common/location.entity';
import { Route } from '../common/route.entity';
import { Trip } from '../trip/trip.entity';
import { CoachType } from './coach-type.entity';

@Entity({ name: 'coaches' })
export class Coach extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  numberPlate!: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @ManyToOne(() => CoachType, (type) => type.coaches, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'typeId' })
  type: CoachType;

  @Column()
  typeId: number;

  @ManyToOne(() => Location, (location) => location.coaches, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column()
  locationId: number;

  @ManyToOne(() => Route, (route) => route.coaches, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'routeId' })
  route: Route;

  @Column()
  routeId: number;

  @OneToMany(() => Trip, (trip) => trip.coach)
  trips: Trip[];
}
