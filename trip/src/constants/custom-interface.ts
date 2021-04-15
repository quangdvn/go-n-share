import { Location } from '@quangdvnnnn/go-n-share';

export interface RouteFetchingResponse {
  success: boolean;
  data: RouteData | null;
}

export interface CoachFetchingResponse {
  drivingDuration: number;
  departureLocation: Location;
  arriveLocation: Location;
}

export interface RouteData {
  routes: RouteResponse[];
  coaches: CoachResponse[];
}

export interface RouteResponse {
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
}

export interface CoachResponse {
  name: string;
  id: number;
  numberPlate: string;
  isAvailable: boolean;
  typeId: number;
  locationId: number;
  routeId: number;
  trips: TripResponse[];
  type: TypeResponse;
}

export interface TripResponse {
  id: number;
  departureDate: string;
  departureTime: number;
  departureLocation: Location;
  arriveDate: string;
  arriveTime: number;
  arriveLocation: Location;
  tripStatus: string;
  coachId: number;
}

export interface TypeResponse {
  id: number;
  seatNumber: number;
  name: string;
}
