export interface DriverInfo {
  success: boolean;
  data: DriverInfoData;
}

export interface LocationData {
  _id: string;
  name: string;
  subname: string;
}

export interface DriverInfoData {
  hasAssignedTrip: boolean;
  workingStatus: string;
  isVerify: boolean;
  schedule: number[];
  _id: string;
  id: number;
  age: number;
  fullname: string;
  location: LocationData;
  phone: string;
  role: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface StaffInfo {
  success: boolean;
  data: StaffInfoData;
}

export interface StaffInfoData {
  id: number;
  username: string;
  fullname: string;
  phone: string;
  role: string;
  workingStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
