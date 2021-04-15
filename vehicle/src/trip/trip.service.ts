import { Injectable } from '@nestjs/common';
import {
  TripCreatedEvent,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { getConnection } from 'typeorm';
import { Trip } from './trip.entity';

@Injectable()
export class TripService {
  constructor() {}

  async createTrip({ tripData }: TripCreatedEvent) {
    const firstTrip = await Trip.create({
      id: tripData[0].id,
      departureDate: tripData[0].departureDate,
      departureTime: tripData[0].departureTime,
      departureLocation: tripData[0].departureLocation,
      arriveDate: tripData[0].arriveDate,
      arriveTime: tripData[0].arriveTime,
      arriveLocation: tripData[0].arriveLocation,
      coachId: tripData[0].coachId,
    }).save();

    const secondTrip = await Trip.create({
      id: tripData[1].id,
      departureDate: tripData[1].departureDate,
      departureTime: tripData[1].departureTime,
      departureLocation: tripData[1].departureLocation,
      arriveDate: tripData[1].arriveDate,
      arriveTime: tripData[1].arriveTime,
      arriveLocation: tripData[1].arriveLocation,
      coachId: tripData[1].coachId,
    }).save();

    return [firstTrip, secondTrip];
  }

  async updateTripStatus(data: TripStatusUpdatedEvent) {
    const returnData = await getConnection()
      .createQueryBuilder()
      .update(Trip)
      .set({ tripStatus: data.status })
      .where('id = :id', { id: data.tripId })
      .execute();
    return returnData;
  }
}
