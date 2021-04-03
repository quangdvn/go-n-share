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
import { LogInType } from '../constants';

@ObjectType()
class LogInResponse {
  @Field(() => [String], { nullable: true })
  error?: string[];

  @Field(() => String, { nullable: true })
  token?: string;
}

@Resolver()
export class AuthResolver {
  @Query(() => String)
  authService(@Ctx() ctx: any) {
    return ctx.dataSources.authService.getHello();
  }

  @Query(() => LogInResponse, { nullable: true })
  async logIn(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Arg('type', () => LogInType) type: LogInType,
    @Ctx() ctx: any
  ) {
    const res = await ctx.dataSources.authService.logIn(
      username,
      password,
      type
    );
    return res;
  }

  @Query(() => Boolean)
  async logOut(@Ctx() ctx: any) {
    return ctx.dataSources.authService.logOut();
  }
}
