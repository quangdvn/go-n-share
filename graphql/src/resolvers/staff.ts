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
  staff(@Ctx() ctx: any) {
    return ctx.dataSources.staffService.getInfo();
  }
}
