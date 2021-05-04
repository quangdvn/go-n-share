import { Location, TripStatus } from '@quangdvnnnn/go-n-share';
import {
  Arg,
  Ctx,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

@ObjectType()
class TripData {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  departureDate: string;

  @Field(() => Int)
  departureTime: number;

  @Field(() => String)
  departureLocation: Location;

  @Field(() => String)
  arriveDate: string;

  @Field(() => Int)
  arriveTime: number;

  @Field(() => String)
  arriveLocation: Location;

  @Field(() => String)
  tripStatus: TripStatus;
}

@ObjectType()
class CoachData {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  numberPlate: string;

  @Field(() => Boolean)
  isAvailable: boolean;

  @Field(() => Int)
  seatNumber: number;

  @Field(() => [TripData], { nullable: true })
  trips: TripData[];
}

@ObjectType()
class RouteData {
  @Field(() => Int)
  routeId: number;

  @Field(() => Int)
  drivingDuration: number;

  @Field(() => Int)
  basePrice: number;

  @Field(() => String)
  departureTerminal: string;

  @Field(() => String)
  departureAddress: string;

  @Field(() => String)
  departureLatitude: string;

  @Field(() => String)
  departureLongitude: string;

  @Field(() => String)
  arriveTerminal: string;

  @Field(() => String)
  arriveAddress: string;

  @Field(() => String)
  arriveLatitude: string;

  @Field(() => String)
  arriveLongitude: string;

  @Field(() => [CoachData], { nullable: true })
  coaches: CoachData[];
}

@ObjectType()
class SearchResponse {
  @Field(() => [String], { nullable: true })
  error?: string[];

  @Field(() => [RouteData], { nullable: true })
  data: RouteData[];
}

@ObjectType()
class OneTransitDetails {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  bookingName: string;

  @Field(() => String)
  bookingPhone: string;

  @Field(() => String)
  bookingStatus: string;

  @Field(() => String)
  notes: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  latitude: string;

  @Field(() => String)
  longitude: string;

  @Field(() => Int)
  transitId: number;

  @Field(() => Boolean)
  isVerify: boolean;

  @Field(() => Boolean)
  isCancel: boolean;

  @Field(() => String)
  transitStatus: string;
}

@ObjectType()
class OneTransitResponse {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  departureDate: string;

  @Field(() => Int)
  departureShift: number;

  @Field(() => String)
  transitStatus: string;

  @Field(() => String)
  cabId: number;

  @Field(() => String)
  driverId: number;

  @Field(() => Int)
  tripId: number;

  @Field(() => [OneTransitDetails], { nullable: true })
  details: OneTransitDetails[];

  @Field(() => String)
  numberPlate: string;

  @Field(() => Int)
  seatNumber: number;

  @Field(() => String)
  cabName: string;
}

@ObjectType()
class GetTransitResponse {
  @Field(() => [String], { nullable: true })
  error?: string[];

  @Field(() => OneTransitResponse, { nullable: true })
  data: OneTransitResponse;
}

@ObjectType()
class OneTripBooking {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  bookingName: string;

  @Field(() => String)
  bookingMail: string;

  @Field(() => String)
  bookingPhone: string;

  @Field(() => Int)
  totalPrice: number;

  @Field(() => String)
  notes: string;

  @Field(() => String)
  paymentMethod: string;
}

@ObjectType()
class OneTripResponse {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  departureDate: string;

  @Field(() => Int)
  departureTime: number;

  @Field(() => String)
  departureLocation: string;

  @Field(() => String)
  arriveDate: string;

  @Field(() => Int)
  arriveTime: number;

  @Field(() => String)
  arriveLocation: string;

  @Field(() => String)
  tripStatus: string;

  @Field(() => Int)
  coachId: number;

  @Field(() => Int)
  driverId: number;

  @Field(() => Int)
  bookedSeat: number;

  @Field(() => [OneTripBooking], { nullable: true })
  bookings: OneTripBooking[];

  @Field(() => String)
  numberPlate: string;

  @Field(() => Int)
  seatNumber: number;

  @Field(() => String)
  coachName: string;
}

@ObjectType()
class GetTripResponse {
  @Field(() => [String], { nullable: true })
  error?: string[];

  @Field(() => OneTripResponse, { nullable: true })
  data: OneTripResponse;
}

@Resolver()
export class TripResolver {
  @Query(() => String)
  tripService(@Ctx() ctx: any) {
    return ctx.dataSources.tripService.getHello();
  }

  @Query(() => SearchResponse)
  searchTrip(
    @Ctx() ctx: any,
    @Arg('departure', () => Location) departure: Location,
    @Arg('arrive', () => Location) arrive: Location,
    @Arg('departureDate', () => String) departureDate: string
  ) {
    return ctx.dataSources.tripService.searchTrip(
      departure,
      arrive,
      departureDate
    );
  }

  @Query(() => GetTransitResponse)
  getTransitDetail(
    @Ctx() ctx: any,
    @Arg('transitId', () => Int) transitId: number
  ) {
    return ctx.dataSources.tripService.getTransitDetail(transitId);
  }

  @Query(() => GetTripResponse)
  getTripDetail(@Ctx() ctx: any, @Arg('tripId', () => Int) tripId: number) {
    return ctx.dataSources.tripService.getTripDetail(tripId);
  }
}
