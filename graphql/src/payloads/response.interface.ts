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
  transits: TransitData[];
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

export interface TransitData {
  id: number;
  tripId: number;
  departureDate: string;
  departureShift: number;
  transitStatus: string;
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

export interface SearchTripResponse {
  success: boolean;
  data: SearchTripData[];
}

export interface SearchTripData {
  routeId: number;
  drivingDuration: number;
  basePrice: number;
  departureTerminal: string;
  departureAddress: string;
  departureLatitude: string;
  departureLongitude: string;
  arriveTerminal: string;
  arriveAddress: string;
  arriveLatitude: string;
  arriveLongitude: string;
  coaches: CoachData[];
}

export interface CoachData {
  id: number;
  routeId: number;
  name: string;
  numberPlate: string;
  isAvailable: boolean;
  seatNumber: number;
  trips: CoachTripData[];
}

export interface CoachTripData {
  id: number;
  departureDate: string;
  departureTime: number;
  departureLocation: LocationEnum;
  arriveDate: string;
  arriveTime: number;
  arriveLocation: LocationEnum;
  tripStatus: string;
  coachId: number;
}

export interface GetAllBookingResponse {
  success: boolean;
  data: GetAllBookingData[];
}

export interface GetAllBookingData {
  id: number;
  bookingName: string;
  bookingMail: string;
  bookingPhone: string;
  totalPrice: number;
  isVerify: boolean;
  isCancel: boolean;
  hasTransit: boolean;
  transitDetailId: number | null;
  notes: string;
  tripId: number;
  bookingStatus: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  transitDetail: BookingTransitDetail | null;
  tripDetail: BookingTripDetail;
}

export interface BookingTransitDetail {
  id: number;
  bookingName: string;
  bookingPhone: string;
  bookingStatus: string;
  notes: string;
  address: string;
  latitude: string;
  longitude: string;
  transitId: number;
  isVerify: boolean;
  isCancel: boolean;
  transitStatus: string;
}

export interface BookingTripDetail {
  id: number;
  departureDate: string;
  departureTime: number;
  departureLocation: string;
  arriveDate: string;
  arriveTime: number;
  arriveLocation: string;
}

export interface OneTransitResponse {
  success: boolean;
  data: OneTransitData;
}

export interface OneTransitData {
  id: number;
  departureDate: string;
  departureShift: number;
  transitStatus: string;
  cabId: number;
  driverId: number;
  tripId: number;
  createdAt: Date;
  updatedAt: Date;
  details: OneTransitDetails[];
  numberPlate: string;
  seatNumber: number;
  cabName: string;
  routeId: number;
  drivingDuration: number;
  basePrice: number;
  departureTerminal: string;
  departureAddress: string;
  departureLatitude: string;
  departureLongitude: string;
  departureId: number;
  departureName: string;
  departureSubName: string;
  arriveTerminal: string;
  arriveAddress: string;
  arriveLatitude: string;
  arriveLongitude: string;
  arriveId: number;
  arriveName: string;
  arriveSubName: string;
}

export interface OneTransitDetails {
  id: number;
  bookingName: string;
  bookingPhone: string;
  bookingStatus: string;
  notes: string;
  address: string;
  latitude: string;
  longitude: string;
  transitId: number;
  isVerify: boolean;
  isCancel: boolean;
  transitStatus: string;
}

export interface OneTripResponse {
  success: boolean;
  data: OneTripData;
}

export interface OneTripData {
  id: number;
  departureDate: string;
  departureTime: number;
  departureLocation: string;
  arriveDate: string;
  arriveTime: number;
  arriveLocation: string;
  tripStatus: string;
  coachId: number;
  driverId: number;
  bookedSeat: number;
  createdAt: Date;
  updatedAt: Date;
  bookings: OneTripBooking[];
  numberPlate: string;
  seatNumber: number;
  coachName: string;
  fixedDepartureTerminal: string;
  fixedDepartureAddress: string;
  fixedDepartureLatitude: string;
  fixedDepartureLongitude: string;
  fixedDepartureId: number;
  fixedDepartureName: string;
  fixedDepartureSubName: string;
  fixedArriveTerminal: string;
  fixedArriveAddress: string;
  fixedArriveLatitude: string;
  fixedArriveLongitude: string;
  fixedArriveId: number;
  fixedArriveName: string;
  fixedArriveSubName: string;
}

export interface OneTripBooking {
  id: number;
  bookingName: string;
  bookingMail: string;
  bookingPhone: string;
  totalPrice: number;
  notes: string;
  paymentMethod: string;
}
