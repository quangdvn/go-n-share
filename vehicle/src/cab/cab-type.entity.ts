import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cab } from './cab.entity';

@Entity({ name: 'cabTypes' })
export class CabType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  seatNumber!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Cab, (cab) => cab.type)
  cabs: Cab[];
}
