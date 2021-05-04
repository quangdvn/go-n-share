import { Ctx, Field, Int, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class BookingTransitDetailResponse {
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
class BookingTripDetailResponse {
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
}

@ObjectType()
class BookingResponse {
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

  @Field(() => Boolean)
  isVerify: boolean;

  @Field(() => Boolean)
  isCancel: boolean;

  @Field(() => Boolean)
  hasTransit: boolean;

  @Field(() => Int, { nullable: true })
  transitDetailId: number | null;

  @Field(() => String)
  notes: string;

  @Field(() => Int)
  tripId: number;

  @Field(() => String)
  bookingStatus: string;

  @Field(() => String)
  paymentMethod: string;

  @Field(() => BookingTransitDetailResponse, { nullable: true })
  transitDetail: BookingTransitDetailResponse | null;

  @Field(() => BookingTripDetailResponse)
  tripDetail: BookingTripDetailResponse;
}

@Resolver()
export class BookingResolver {
  @Query(() => String)
  bookingService(@Ctx() ctx: any) {
    return ctx.dataSources.bookingService.getHello();
  }

  @Query(() => [BookingResponse])
  async getAllBooking(@Ctx() ctx: any) {
    return ctx.dataSources.bookingService.getAllBooking();
  }
}
