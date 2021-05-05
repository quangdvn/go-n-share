import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingStatus, PaymentMethod } from '@quangdvnnnn/go-n-share';
import { getManager } from 'typeorm';
import {
  TransitData,
  TripBookingFetchingMess,
  TripData,
  VerifyBooking,
} from '../constant/custom-interface';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { VerifyBookingDto } from './dto/verify-booking.dto';

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

  async getAllBookedTrips() {
    const rawBooking: Booking[] = await getManager()
      .createQueryBuilder(Booking, 'booking')
      .select('DISTINCT booking.tripId')
      .getRawMany();
    const res = rawBooking.map((booking) => booking.tripId);
    return res;
  }

  async getAllBooking(tripData: TripData[], transitData: TransitData[]) {
    const rawBooking = await Booking.find();

    const firstRes = rawBooking.map((booking) => {
      const tripDetail = tripData.find((trip) => trip.id === booking.tripId);
      const transitDetail = booking.hasTransit
        ? transitData.find((transit) => transit.id === booking.transitDetailId)
        : null;

      return { ...booking, transitDetail, tripDetail };
    });

    return firstRes;
  }

  async confirmBooking(verifyBookingDto: VerifyBookingDto) {
    const curBooking = await Booking.findOne({
      where: {
        id: verifyBookingDto.bookingId,
        isVerify: false,
        isCancel: false,
      },
    });
    if (!curBooking) {
      throw new BadRequestException('Mã vé không tồn tại');
    }
    if (verifyBookingDto.confirm === VerifyBooking.ACCEPT) {
      curBooking.isVerify = true;
      await curBooking.save();
      return curBooking;
    } else {
      curBooking.isVerify = true;
      curBooking.isCancel = true;
      await curBooking.save();
      return curBooking;
    }

    // await getConnection()
    //   .createQueryBuilder()
    //   .update(Booking)
    //   .set({  })
    //   .where('id = :id', { id: data.tripId })
    //   .execute();
  }

  async getTripBooking(data: TripBookingFetchingMess) {
    return Booking.find({
      where: {
        tripId: data.tripId,
        isVerify: true,
        isCancel: false,
      },
      select: [
        'id',
        'bookingMail',
        'bookingName',
        'bookingPhone',
        'totalPrice',
        'notes',
        'paymentMethod',
        'bookingStatus',
      ],
    });
  }
}
