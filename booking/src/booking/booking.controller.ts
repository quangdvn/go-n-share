import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  BookingCreatedEvent,
  BookingStatus,
  Events,
  Messages,
  PaymentMethod,
  TransitDetailCreatingMess,
  TripFetchingMess,
} from '@quangdvnnnn/go-n-share';
import { BOOKING_SERVICE } from '../constant';
import { TripFetchingResponse } from '../constant/custom-interface';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

const TripFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TripFetching
    : Messages.TripFetchingDev;

const TransitDetailCreating =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDetailCreating
    : Messages.TransitDetailCreatingDev;

const BookingCreated =
  process.env.NODE_ENV === 'production'
    ? Events.BookingCreated
    : Events.BookingCreatedDev;

// const subLogger = new Logger('EventSubcribe');
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

    const bookingEvent: BookingCreatedEvent = {
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
      transitDetail: {
        address: createBookingDto.transitDetail.address,
        latitude: createBookingDto.transitDetail.latitude,
        longitude: createBookingDto.transitDetail.longitude,
        notes: createBookingDto.transitDetail.notes,
      },
    };

    this.client
      .emit<string, BookingCreatedEvent>(BookingCreated, bookingEvent)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: res,
    };
  }
}
