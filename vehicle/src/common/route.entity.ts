import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from '../coach/coach.entity';
import { Terminal } from './terminal.entity';

@Entity({ name: 'routes' })
export class Route extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  drivingDuration!: number;

  @Column()
  basePrice!: number;

  @ManyToOne(() => Terminal, (terminal) => terminal.departures, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'departureId' })
  departure: Terminal;

  @Column()
  departureId: number;

  @ManyToOne(() => Terminal, (terminal) => terminal.arrives, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'arriveId' })
  arrive: Terminal;

  @Column()
  arriveId: number;

  @OneToMany(() => Coach, (coach) => coach.route)
  coaches: Coach[];
}
