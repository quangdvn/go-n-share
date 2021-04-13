import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from './coach.entity';

@Entity({ name: 'coachTypes' })
export class CoachType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  seatNumber!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Coach, (coach) => coach.type)
  coaches: Coach[];
}
