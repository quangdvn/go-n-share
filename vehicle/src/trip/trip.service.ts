import { Injectable } from '@nestjs/common';
import { TripCreatedEvent } from '@quangdvnnnn/go-n-share';
import { Trip } from './trip.entity';

@Injectable()
export class TripService {
  constructor() {}

  async createTrip({ tripData }: TripCreatedEvent) {
    const firstTrip = await Trip.create({
      id: tripData[0].id,
      departureDate: tripData[0].departureDate,
      departureTime: tripData[0].departureTime,
      arriveDate: tripData[0].arriveDate,
      arriveTime: tripData[0].arriveTime,
      coachId: tripData[0].coachId,
    }).save();

    const secondTrip = await Trip.create({
      id: tripData[1].id,
      departureDate: tripData[1].departureDate,
      departureTime: tripData[1].departureTime,
      arriveDate: tripData[1].arriveDate,
      arriveTime: tripData[1].arriveTime,
      coachId: tripData[1].coachId,
    }).save();

    return [firstTrip, secondTrip];
  }
}
