import { AuthRoles, StaffRoles, WorkingStatus } from '@quangdvnnnn/go-n-share';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'staffs' })
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: String, default: StaffRoles.SUPERVISING })
  role: StaffRoles;

  @Column({ type: String, default: WorkingStatus.WORKING })
  workingStatus: WorkingStatus;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  validatePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  generateAuthToken(): string {
    const staff = this;
    const token = jwt.sign(
      {
        auth: AuthRoles.STAFF,
        data: {
          id: staff.id,
          workingStatus: staff.workingStatus,
          role: staff.role,
        },
      },
      process.env.JWT_SECRET,
    );
    return token;
  }
}
