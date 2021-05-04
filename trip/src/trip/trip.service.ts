import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AllTripFetchingMess,
  BookingVerifiedEvent,
  TripFetchingMess,
  TripStatus,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { getConnection } from 'typeorm';
import {
  CoachFetchingResponse,
  RouteData,
} from '../constants/custom-interface';
import { TransitDetail } from '../transit/transit-detail.entity';
import { getTripInfo } from '../utils/getTripInfo';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { Trip } from './trip.entity';

@Injectable()
export class TripService {
  constructor() {}

  async getTripCoach(tripId: number) {
    const res = await Trip.findOne({
      select: ['coachId'],
      where: {
        id: tripId,
      },
    });
    return res.coachId;
  }

  async getTrip(id: number) {
    const res = await Trip.findOne({
      where: {
        id: id,
      },
    });
    if (!res) {
      throw new BadRequestException('Chuyến đi không tồn tại');
    }

    return res;
  }

  async updateTripBooking(data: BookingVerifiedEvent, maxSeat: number) {
    await getConnection()
      .createQueryBuilder()
      .update(Trip)
      .set({ bookedSeat: () => 'bookedSeat + 1' })
      .where('id = :id', { id: data.tripId })
      .execute();

    if (data.hasTransit) {
      await getConnection()
        .createQueryBuilder()
        .update(TransitDetail)
        .set({ isVerify: data.isVerify, isCancel: data.isCancel })
        .where('id = :id', { id: data.transitDetailId })
        .execute();
    }

    const res = await Trip.findOne({
      where: {
        id: data.tripId,
      },
      select: ['bookedSeat'],
    });
    if (res.bookedSeat === maxSeat) {
      await getConnection()
        .createQueryBuilder()
        .update(Trip)
        .set({ tripStatus: TripStatus.FULL })
        .where('id = :id', { id: data.tripId })
        .execute();
    }
    return true;
  }

  async tripFetching(data: TripFetchingMess) {
    const curTrip = await getConnection()
      .createQueryBuilder(Trip, 'trip')
      .where('trip.id = :id', { id: data.tripId })
      .andWhere(`trip.tripStatus = :status`, { status: TripStatus.READY })
      .orderBy('trip.id')
      .select([
        'trip.id',
        'trip.departureDate',
        'trip.departureTime',
        'trip.departureLocation',
        'trip.arriveDate',
        'trip.arriveTime',
        'trip.arriveLocation',
      ])
      .getOne();
    return curTrip;
  }

  async allTripFetching(data: AllTripFetchingMess) {
    const curTrip = await getConnection()
      .createQueryBuilder(Trip, 'trip')
      .where('trip.id IN (:...ids)', { ids: data.tripIds })
      .andWhere(`trip.tripStatus = :status`, { status: TripStatus.READY })
      .orderBy('trip.id')
      .select([
        'trip.id',
        'trip.departureDate',
        'trip.departureTime',
        'trip.departureLocation',
        'trip.arriveDate',
        'trip.arriveTime',
        'trip.arriveLocation',
      ])
      .getMany();
    return curTrip;
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
