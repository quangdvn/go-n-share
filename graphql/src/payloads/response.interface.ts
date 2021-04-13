import { Location as LocationEnum } from '@quangdvnnnn/go-n-share';

export interface DriverInfoResponse {
  success: boolean;
  data: DriverInfoData;
}

export interface GetAvailableDriversResponse {
  success: boolean;
  data: DriverInfoData[];
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
  trips: TripData[];
  phone: string;
  role: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface GetAvailableCoachesResponse {
  success: boolean;
  data: GetAvailableCoachesData[];
}

export interface GetAvailableCoachesData {
  id: number;
  numberPlate: string;
  isAvailable: boolean;
  name: string;
  type: VehicleTypeData;
  trips: TripData[];
}

export interface VehicleTypeData {
  seatNumber: number;
  name: string;
}

export interface TripData {
  id: number;
  tripStatus: string;
  departureDate: string;
  departureTime: number;
  arriveDate: string;
  arriveTime: number;
}

export interface LocationData {
  _id: string;
  name: string;
  subname: string;
}

export interface StaffInfoResponse {
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

export interface LogInResponse {
  success: boolean;
  data: string;
}

export interface LogOutResponse {
  success: boolean;
}

export interface GetRoutesResponse {
  success: boolean;
  data: GetRoutesData[];
}

export interface GetRoutesData {
  routeId: number;
  departureLocation: LocationEnum;
  arriveLocation: LocationEnum;
  departureTerminal: string;
  arriveTerminal: string;
  drivingDuration: number;
}
