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
}
