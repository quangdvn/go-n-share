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
import { Transit } from '../transit/transit.entity';
import { CabType } from './cab-type.entity';

@Entity({ name: 'cabs' })
export class Cab extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  numberPlate!: string;

  @Column({ default: true })
  isAvailable!: boolean;

  @ManyToOne(() => CabType, (type) => type.cabs, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'typeId' })
  type: CabType;

  @Column()
  typeId: number;

  @ManyToOne(() => Location, (location) => location.cabs, {
    onDelete: 'CASCADE',
    cascade: ['update'],
  })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @OneToMany(() => Transit, (transit) => transit.cab)
  transits: Transit[];

  @Column()
  locationId: number;
}
