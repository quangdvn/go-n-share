import { Injectable } from '@nestjs/common';
import { getTripInfo } from '../utils/getTripInfo';
import { CreateTripDto } from './dto/create-trip.dto';
import { Trip } from './trip.entity';

@Injectable()
export class TripService {
  constructor() {}

  async createTrip(createTripDto: CreateTripDto, drivingDuration: number) {
    const data = getTripInfo({
      departureDate: createTripDto.departureDate,
      departureTime: createTripDto.shift,
      tripDuration: drivingDuration,
    });

    const firstTrip = await Trip.create({
      departureDate: data.firstDepartureDate,
      departureTime: data.firstDepartureTime,
      arriveDate: data.firstArriveDate,
      arriveTime: data.firstArriveTime,
      coachId: createTripDto.coachId,
      driverId: createTripDto.driverId,
    }).save();

    const secondTrip = await Trip.create({
      departureDate: data.secondDepartureDate,
      departureTime: data.secondDepartureTime,
      arriveDate: data.secondArriveDate,
      arriveTime: data.secondArriveTime,
      coachId: createTripDto.coachId,
      driverId: createTripDto.driverId,
    }).save();

    return [firstTrip, secondTrip];
  }
}
