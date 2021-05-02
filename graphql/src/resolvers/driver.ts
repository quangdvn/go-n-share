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
  @Field({ nullable: true })
  tripStatus: string;

  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  departureDate: string;

  @Field(() => Int, { nullable: true })
  departureTime: number;

  @Field({ nullable: true })
  arriveDate: string;

  @Field(() => Int, { nullable: true })
  arriveTime: number;
}

@ObjectType()
class TransitInfo {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field(() => Int, { nullable: true })
  tripId: number;

  @Field(() => Int, { nullable: true })
  departureShift: number;

  @Field(() => String, { nullable: true })
  departureDate: string;

  @Field(() => String, { nullable: true })
  transitStatus: string;
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

  @Field(() => [TransitInfo], { nullable: true })
  transits: TransitInfo[];

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
