import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Terminal } from './terminal.entity';
import { Location as LocationEnum } from '@quangdvnnnn/go-n-share';
import { Coach } from '../coach/coach.entity';
import { Cab } from '../cab/cab.entity';

@Entity({ name: 'locations' })
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', unique: true, enum: LocationEnum })
  name!: LocationEnum;

  @Column({ type: 'enum', unique: true, enum: LocationEnum })
  subname!: LocationEnum;

  @OneToMany(() => Terminal, (terminal) => terminal.location)
  terminals: Terminal[];

  @OneToMany(() => Coach, (coach) => coach.location)
  coaches: Coach[];

  @OneToMany(() => Cab, (cab) => cab.location)
  cabs: Cab[];
}
