import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Route } from './route.entity';

@Entity({ name: 'terminals' })
export class Terminal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column()
  latitude!: string;

  @Column()
  longitude!: string;

  @ManyToOne(() => Location, (location) => location.terminals, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column()
  locationId: number;

  @OneToMany(() => Route, (route) => route.arrive)
  arrives: Route[];

  @OneToMany(() => Route, (route) => route.departure)
  departures: Route[];
}
