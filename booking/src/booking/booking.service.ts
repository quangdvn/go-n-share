import { Injectable } from '@nestjs/common';
import { BookingStatus, PaymentMethod } from '@quangdvnnnn/go-n-share';
import { TripData } from '../constant/custom-interface';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor() {}

  async createBooking(
    createBookingDto: CreateBookingDto,
    tripData: TripData,
    transitId: number | null,
  ) {
    const booking = await Booking.create({
      bookingName: createBookingDto.bookingName,
      bookingPhone: createBookingDto.bookingPhone,
      bookingMail: createBookingDto.bookingMail,
      totalPrice: createBookingDto.price,
      hasTransit: createBookingDto.hasTransit,
      transitDetailId: transitId ? transitId : null,
      notes: createBookingDto.notes,
      tripId: tripData.id,
      paymentMethod: createBookingDto.paymentMethod,
      bookingStatus:
        createBookingDto.paymentMethod === PaymentMethod.CASH
          ? BookingStatus.PENDING
          : BookingStatus.SUCCESS,
    }).save();
    return booking;
  }
}
