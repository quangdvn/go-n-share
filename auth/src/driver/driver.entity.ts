import { AuthRoles, DriverRoles, WorkingStatus } from '@quangdvnnnn/go-n-share';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'drivers' })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column()
  role: DriverRoles;

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
    const driver = this;
    const token = jwt.sign(
      {
        auth: AuthRoles.DRIVER,
        data: {
          id: driver.id,
          workingStatus: driver.workingStatus,
          role: driver.role,
        },
      },
      process.env.JWT_SECRET,
    );
    return token;
  }
}
