import { StaffRoles, WorkingStatus } from '@quangdvnnnn/go-n-share';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'staffs' })
export class Staff extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  fullname: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: StaffRoles, default: StaffRoles.SUPERVISING })
  role: StaffRoles;

  @Column({ type: 'enum', enum: WorkingStatus, default: WorkingStatus.WORKING })
  workingStatus: WorkingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
