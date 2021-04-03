import { Ctx, Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class StaffInfo {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  fullname: string;

  @Field()
  phone: string;

  @Field()
  role: string;

  @Field()
  workingStatus: string;
}

@Resolver()
export class StaffResolver {
  @Query(() => StaffInfo)
  staffInfo(@Ctx() ctx: any) {
    return ctx.dataSources.staffService.getInfo();
  }

  @Query(() => String)
  staffService(@Ctx() ctx: any) {
    return ctx.dataSources.staffService.getHello();
  }
}
