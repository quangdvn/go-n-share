import { Injectable } from '@nestjs/common';
import { TripStatusUpdatedEvent } from '@quangdvnnnn/go-n-share';
import { getConnection } from 'typeorm';
import {
  CoachFetchingResponse,
  RouteData,
} from '../constants/custom-interface';
import { getTripInfo } from '../utils/getTripInfo';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { Trip } from './trip.entity';

@Injectable()
export class TripService {
  constructor() {}

  async updateTripStatus(data: TripStatusUpdatedEvent) {
    const returnData = await getConnection()
      .createQueryBuilder()
      .update(Trip)
      .set({ tripStatus: data.status })
      .where('id = :id', { id: data.tripId })
      .execute();
    return returnData;
  }

  async createTrip(
    createTripDto: CreateTripDto,
    coachData: CoachFetchingResponse,
  ) {
    const data = getTripInfo({
      departureDate: createTripDto.departureDate,
      departureTime: createTripDto.shift,
      tripDuration: coachData.drivingDuration,
    });

    const firstTrip = await Trip.create({
      departureDate: data.firstDepartureDate,
      departureTime: data.firstDepartureTime,
      departureLocation: coachData.departureLocation,
      arriveDate: data.firstArriveDate,
      arriveTime: data.firstArriveTime,
      arriveLocation: coachData.arriveLocation,
      coachId: createTripDto.coachId,
      driverId: createTripDto.driverId,
    }).save();

    const secondTrip = await Trip.create({
      departureDate: data.secondDepartureDate,
      departureTime: data.secondDepartureTime,
      departureLocation: coachData.arriveLocation,
      arriveDate: data.secondArriveDate,
      arriveTime: data.secondArriveTime,
      arriveLocation: coachData.departureLocation,
      coachId: createTripDto.coachId,
      driverId: createTripDto.driverId,
    }).save();

    return [firstTrip, secondTrip];
  }

  async searchTrip(
    { coaches, routes }: RouteData,
    searchTripDto: SearchTripDto,
  ) {
    const filterCoaches = coaches.map((coach) => {
      const curTrips = coach.trips.filter(
        (trip) =>
          trip.departureDate === searchTripDto.departureDate &&
          trip.departureLocation === searchTripDto.departure &&
          trip.arriveLocation === searchTripDto.arrive,
      );
      return {
        id: coach.id,
        routeId: coach.routeId,
        name: coach.name,
        numberPlate: coach.numberPlate,
        isAvailable: coach.isAvailable,
        trips: curTrips,
        seatNumber: coach.type.seatNumber,
      };
    });

    const res = routes.map((route) => {
      const curCoaches = filterCoaches.filter(
        (coach) => coach.routeId === route.routeId,
      );
      return { ...route, coaches: curCoaches };
    });
    return res;
  }
}
