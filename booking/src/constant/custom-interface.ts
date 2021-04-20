export interface TripFetchingResponse {
  success: boolean;
  data: TripData | null;
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
