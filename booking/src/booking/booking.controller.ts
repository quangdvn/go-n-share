import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AllTripFetchingMess,
  BookingStatus,
  BookingVerifiedEvent,
  Events,
  Messages,
  PaymentMethod,
  StaffRoles,
  TransitDetailCreatingMess,
  TransitDetailFetchingMess,
  TripFetchingMess,
} from '@quangdvnnnn/go-n-share';
import { BOOKING_SERVICE } from '../constant';
import {
  AllTripFetchingResponse,
  TransitDetailFetchingResponse,
  TripBookingFetchingMess,
  TripFetchingResponse,
} from '../constant/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { VerifyBookingDto } from './dto/verify-booking.dto';

const TripFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TripFetching
    : Messages.TripFetchingDev;

const TransitDetailCreating =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDetailCreating
    : Messages.TransitDetailCreatingDev;

// const BookingCreated =
//   process.env.NODE_ENV === 'production'
//     ? Events.BookingCreated
//     : Events.BookingCreatedDev;

const BookingVerified =
  process.env.NODE_ENV === 'production'
    ? Events.BookingVerified
    : Events.BookingVerifiedDev;

const TransitDetailFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDetailFetching
    : Messages.TransitDetailFetchingDev;

const AllTripFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.AllTripFetching
    : Messages.AllTripFetchingDev;

const TripBookingFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TripBookingFetching
    : Messages.TripBookingFetchingDev;

const pubLogger = new Logger('EventPublish');

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    @Inject(BOOKING_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  @HttpCode(201)
  async createBooking(
    @Body(ValidationPipe) createBookingDto: CreateBookingDto,
  ) {
    const tripMessage: TripFetchingMess = {
      tripId: createBookingDto.tripId,
    };

    const tripData = await this.client
      .send<TripFetchingResponse, TripFetchingMess>(TripFetching, tripMessage)
      .toPromise();
    if (!tripData.success) {
      throw new BadRequestException('Chuyến đi không tồn tại');
    }
    let transtDetailId = null as number | null;
    if (createBookingDto.hasTransit) {
      const transitMessage: TransitDetailCreatingMess = {
        tripId: createBookingDto.tripId,
        bookingName: createBookingDto.bookingName,
        bookingPhone: createBookingDto.bookingPhone,
        bookingStatus:
          createBookingDto.paymentMethod === PaymentMethod.CASH
            ? BookingStatus.PENDING
            : BookingStatus.SUCCESS,
        transitDetail: {
          address: createBookingDto.transitDetail.address,
          latitude: createBookingDto.transitDetail.latitude,
          longitude: createBookingDto.transitDetail.longitude,
          notes: createBookingDto.transitDetail.notes,
        },
      };

      const transitRes = await this.client
        .send<
          { success: boolean; data: number | null },
          TransitDetailCreatingMess
        >(TransitDetailCreating, transitMessage)
        .toPromise();
      if (transitRes.success) {
        transtDetailId = transitRes.data;
      }
    }
    const res = await this.bookingService.createBooking(
      createBookingDto,
      tripData.data,
      transtDetailId,
    );

    // const bookingEvent: BookingCreatedEvent = {
    //   id: res.id,
    //   tripId: res.tripId,
    //   bookingName: res.bookingName,
    //   bookingMail: res.bookingMail,
    //   bookingPhone: res.bookingPhone,
    //   totalPrice: res.totalPrice,
    //   hasTransit: res.hasTransit,
    //   transitDetailId: res.transitDetailId,
    //   notes: res.notes,
    //   isVerify: res.isVerify,
    //   bookingStatus: res.bookingStatus,
    //   paymentMethod: res.paymentMethod,
    //   transitDetail: {
    //     address: createBookingDto.transitDetail.address || null,
    //     latitude: createBookingDto.transitDetail.latitude || null,
    //     longitude: createBookingDto.transitDetail.longitude || null,
    //     notes: createBookingDto.transitDetail.notes || null,
    //   },
    // };

    // this.client
    //   .emit<string, BookingCreatedEvent>(BookingCreated, bookingEvent)
    //   .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: res,
    };
  }

  @Get()
  @HttpCode(200)
  async getAllBooking() {
    const tripIds = await this.bookingService.getAllBookedTrips();

    const tripMessage: AllTripFetchingMess = {
      tripIds: tripIds,
    };
    const tripData = await this.client
      .send<AllTripFetchingResponse, AllTripFetchingMess>(
        AllTripFetching,
        tripMessage,
      )
      .toPromise();
    if (!tripData.success) {
      throw new BadRequestException('Chuyến đi không tồn tại');
    }

    const transitMessage: TransitDetailFetchingMess = {};

    const transitData = await this.client
      .send<TransitDetailFetchingResponse, TransitDetailFetchingMess>(
        TransitDetailFetching,
        transitMessage,
      )
      .toPromise();
    if (!transitData.success) {
      throw new BadRequestException('Chuyến đi cố định không tồn tại');
    }

    const res = await this.bookingService.getAllBooking(
      tripData.data,
      transitData.data,
    );

    return {
      success: true,
      data: res,
    };
  }

  @Post('verify')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SCHEDULING)
  async confirmBooking(
    @Body(ValidationPipe) verifyBookingDto: VerifyBookingDto,
  ) {
    const res = await this.bookingService.confirmBooking(verifyBookingDto);

    const bookingEvent: BookingVerifiedEvent = {
      id: res.id,
      tripId: res.tripId,
      bookingName: res.bookingName,
      bookingMail: res.bookingMail,
      bookingPhone: res.bookingPhone,
      totalPrice: res.totalPrice,
      hasTransit: res.hasTransit,
      transitDetailId: res.transitDetailId,
      notes: res.notes,
      isVerify: res.isVerify,
      bookingStatus: res.bookingStatus,
      paymentMethod: res.paymentMethod,
      isCancel: res.isCancel,
    };

    this.client
      .emit<string, BookingVerifiedEvent>(BookingVerified, bookingEvent)
      .subscribe(() => pubLogger.log('Event published successfully...'));
    return {
      success: true,
      data: res,
    };
  }

  @MessagePattern(TripBookingFetching)
  async getTripBooking(@Payload() data: TripBookingFetchingMess) {
    return this.bookingService.getTripBooking(data);
  }
}
