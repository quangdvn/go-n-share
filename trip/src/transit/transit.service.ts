import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BookingVerifiedEvent,
  TransitDetailCreatingMess,
  TransitStatusUpdatedEvent,
  TripCreatedEvent,
} from '@quangdvnnnn/go-n-share';
import { getConnection, getManager } from 'typeorm';
import { getRand } from '../utils/rand';
import { TransitDetail } from './transit-detail.entity';
import { Transit } from './transit.entity';

@Injectable()
export class TransitService {
  constructor() {}

  async updateTransitStatus(data: TransitStatusUpdatedEvent) {
    const returnData = await getConnection()
      .createQueryBuilder()
      .update(Transit)
      .set({ transitStatus: data.status })
      .where('id = :id', { id: data.transitId })
      .execute();
    return returnData;
  }

  async createTransitDetail(data: TransitDetailCreatingMess) {
    const transit = await Transit.findOne({
      where: {
        tripId: data.tripId,
      },
    });
    if (!transit) {
      throw new BadRequestException('Không tìm thấy chuyến trung chuyển');
    }
    const returnData = await TransitDetail.create({
      bookingName: data.bookingName,
      bookingPhone: data.bookingPhone,
      bookingStatus: data.bookingStatus,
      notes: data.transitDetail.notes,
      address: data.transitDetail.address,
      latitude: data.transitDetail.latitude,
      longitude: data.transitDetail.longitude,
      transitId: transit.id,
    }).save();
    return returnData;
  }

  async createTransit(
    { tripData }: TripCreatedEvent,
    firstTransitData: number[],
    firstTransitDriverData: number[],
    secondTransitData: number[],
    secondTransitDriverData: number[],
  ) {
    const firstTransit = await Transit.create({
      departureDate: tripData[0].departureDate,
      departureShift: tripData[0].departureTime,
      cabId: getRand<number>(firstTransitData),
      driverId: getRand<number>(firstTransitDriverData),
      tripId: tripData[0].id,
    }).save();

    const secondTransit = await Transit.create({
      departureDate: tripData[1].departureDate,
      departureShift: tripData[1].departureTime,
      cabId: getRand<number>(secondTransitData),
      driverId: getRand<number>(secondTransitDriverData),
      tripId: tripData[1].id,
    }).save();

    return [firstTransit, secondTransit];
  }

  async updateTransitDetail(data: BookingVerifiedEvent) {
    const res = await getConnection()
      .createQueryBuilder()
      .update(TransitDetail)
      .set({ isVerify: data.isVerify, isCancel: data.isCancel })
      .where('id = :id', { id: data.transitDetailId })
      .execute();

    return res;
  }

  async transitDetailFetching() {
    return TransitDetail.find();
  }

  async getTransit(transitId: number) {
    const res = await getManager()
      .createQueryBuilder(Transit, 'transit')
      .leftJoinAndSelect('transit.details', 'details')
      .where('transit.id = :id', { id: transitId })
      .orderBy('transit.id')
      .getOne();

    if (!res) {
      throw new BadRequestException('Không tìm thấy chuyến trung chuyển');
    }

    return res;
  }
}
