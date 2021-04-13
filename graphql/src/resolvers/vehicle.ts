import { Location, TripShift } from '@quangdvnnnn/go-n-share';
import {
  Arg,
  Ctx,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import {
  GetAvailableCoachesData,
  GetRoutesData,
  VehicleTypeData,
} from '../payloads/response.interface';
import { TripInfo } from './driver';

@ObjectType()
class RoutesResponse implements GetRoutesData {
  @Field(() => Int)
  routeId: number;

  @Field(() => String)
  departureLocation: Location;

  @Field(() => String)
  arriveLocation: Location;

  @Field(() => String)
  departureTerminal: string;

  @Field(() => String)
  arriveTerminal: string;

  @Field(() => Int)
  drivingDuration: number;
}

@ObjectType()
class VehicleType implements VehicleTypeData {
  @Field(() => Int)
  seatNumber: number;

  @Field(() => String)
  name: string;
}

@ObjectType()
class CoachesResponse implements GetAvailableCoachesData {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  numberPlate: string;

  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  isAvailable: boolean;

  @Field(() => VehicleType)
  type: VehicleType;

  @Field(() => [TripInfo], { nullable: true })
  trips: TripInfo[];
}

@Resolver()
export class VehicleResolver {
  @Query(() => String)
  vehicleService(@Ctx() ctx: any) {
    return ctx.dataSources.vehicleService.getHello();
  }

  @Query(() => [RoutesResponse], { nullable: true })
  routes(@Ctx() ctx: any) {
    return ctx.dataSources.vehicleService.getRoutes();
  }

  @Query(() => [CoachesResponse], { nullable: true })
  availableCoaches(
    @Ctx() ctx: any,

    @Arg('departureDate', () => String) departureDate: String,
    @Arg('shift', () => TripShift) shift: TripShift,
    @Arg('routeId', () => Int) routeId: number
  ) {
    return ctx.dataSources.vehicleService.getAvailableCoaches(
      departureDate,
      shift,
      routeId
    );
  }

  // @Query(() => LogInResponse, { nullable: true })
  // async logIn(
  //   @Arg('username') username: string,
  //   @Arg('password') password: string,
  //   @Arg('type', () => LogInType) type: LogInType,
  //   @Ctx() ctx: any
  // ) {
  //   const res = await ctx.dataSources.authService.logIn(
  //     username,
  //     password,
  //     type
  //   );
  //   return res;
  // }

  // @Query(() => Boolean)
  // async logOut(@Ctx() ctx: any) {
  //   return ctx.dataSources.authService.logOut();
  // }
}
