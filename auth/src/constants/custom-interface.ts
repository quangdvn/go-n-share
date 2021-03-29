import { DriverRoles, StaffRoles } from '@quangdvnnnn/go-n-share';
import { Driver } from '../driver/driver.entity';
import { Staff } from '../staff/staff.entity';

export interface StaffLoginPayload {
  staff: Staff;
  token: string;
}

export interface DriverLoginPayload {
  driver: Driver;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  data: string;
}

export interface CreateStaffResponse {
  success: boolean;
  data: Staff;
}

export interface CreateDriverResponse {
  success: boolean;
  data: Driver;
}

export interface CreateStaffInput {
  username: string;
  password: string;
  role: StaffRoles;
}

export interface CreateDriverInput {
  username: string;
  password: string;
  phone: string;
  role: DriverRoles;
}
