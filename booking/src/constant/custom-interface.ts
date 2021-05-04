export interface TripBookingFetchingMess {
  tripId: number;
}

export interface TripFetchingResponse {
  success: boolean;
  data: TripData | null;
}

export interface TransitDetailFetchingResponse {
  success: boolean;
  data: TransitData[] | null;
}

export interface AllTripFetchingResponse {
  success: boolean;
  data: TripData[] | null;
}

export interface TripData {
  id: number;
  departureDate: string;
  departureTime: number;
  departureLocation: string;
  arriveDate: string;
  arriveTime: number;
  arriveLocation: string;
}

export interface TransitData {
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

export enum VerifyBooking {
  ACCEPT = 1,
  DENY = 0,
}
