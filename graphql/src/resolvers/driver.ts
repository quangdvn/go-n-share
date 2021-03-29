import { Ctx, Field, ID, Int, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class LocationInfo {
  @Field()
  name: string;

  @Field()
  subname: string;
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

  @Field(() => String)
  phone: string;

  @Field(() => String)
  role: string;

  @Field(() => String)
  username: string;
}

@Resolver()
export class DriverResolver {
  @Query(() => DriverInfo)
  driver(@Ctx() ctx: any) {
    return ctx.dataSources.driverService.getInfo();
  }
}
