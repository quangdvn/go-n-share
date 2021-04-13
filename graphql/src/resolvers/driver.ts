import {
  DriverRoles as RoleEnum,
  Location as LocationEnum,
  TripShift,
} from '@quangdvnnnn/go-n-share';
import {
  Arg,
  Ctx,
  Field,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';

@ObjectType()
class LocationInfo {
  @Field()
  name: string;

  @Field()
  subname: string;
}

@ObjectType()
export class TripInfo {
  @Field()
  tripStatus: string;

  @Field()
  id: number;

  @Field()
  departureDate: string;

  @Field(() => Int)
  departureTime: number;

  @Field()
  arriveDate: string;

  @Field(() => Int)
  arriveTime: number;
}

@ObjectType()
class DriverInfo {
  @Field(() => ID)
  id: number;

  @Field(() => Boolean)
  hasAssignedTrip: boolean;

  @Field(() => String)
  workingStatus: string;

  @Field(() => Boolean)
  isVerify: boolean;

  @Field(() => [Int], { nullable: true })
  schedule: number[];

  @Field(() => Int)
  age: number;

  @Field(() => String)
  fullname: string;

  @Field(() => LocationInfo)
  location: LocationInfo;

  @Field(() => [TripInfo], { nullable: true })
  trips: TripInfo[];

  @Field(() => String)
  phone: string;

  @Field(() => String)
  role: string;

  @Field(() => String)
  username: string;
}

@ObjectType()
class GetAvaiResponse {
  @Field(() => [String], { nullable: true })
  error?: string[];

  @Field(() => [DriverInfo], { nullable: true })
  data: DriverInfo[];
}

@Resolver()
export class DriverResolver {
  @Query(() => DriverInfo)
  driverInfo(@Ctx() ctx: any) {
    return ctx.dataSources.driverService.getInfo();
  }

  @Query(() => String)
  driverService(@Ctx() ctx: any) {
    return ctx.dataSources.driverService.getHello();
  }

  @Query(() => GetAvaiResponse)
  availableDrivers(
    @Ctx() ctx: any,
    @Arg('location', () => LocationEnum) location: LocationEnum,
    @Arg('role', () => RoleEnum) role: RoleEnum,
    @Arg('departureDate', () => String) departureDate: String,
    @Arg('shift', () => TripShift) shift: TripShift,
    @Arg('drivingDuration', () => Int) drivingDuration: Number
  ) {
    return ctx.dataSources.driverService.getAvailableDrivers(
      location,
      role,
      departureDate,
      shift,
      drivingDuration
    );
  }
}
