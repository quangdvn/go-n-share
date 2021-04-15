import { Injectable } from '@nestjs/common';
import { CoachFetchingMess, RouteFetchingMess } from '@quangdvnnnn/go-n-share';
import dayjs from 'dayjs';
import { getManager } from 'typeorm';
import { Route } from '../common/route.entity';
import { RouteInformation } from '../constant/custom-interface';
import { isDayBetween } from '../utils/isDayBetween';
import { Coach } from './coach.entity';
import { GetAvailableCoachesDto } from './dto/get-avai-coaches.dto';

@Injectable()
export class CoachService {
  constructor() {}

  async getCoaches(data: RouteFetchingMess) {
    const returnRoutes: RouteInformation[] = await getManager().query(
      `
      SELECT R.id as routeId, R.drivingDuration, R.basePrice, 
      T1.name AS departureTerminal, T1.address AS departureAddress, 
      T1.latitude AS departureLatitude, T1.longitude AS departureLongitude,
      T2.name AS arriveTerminal, T2.address AS arriveAddress, 
      T2.latitude AS arriveLatitude, T2.longitude AS arriveLongitude
      FROM routes AS R
      JOIN terminals AS T1 ON R.departureId = T1.id
      JOIN terminals AS T2 ON R.arriveId = T2.id
      JOIN locations AS L1 ON T1.locationId = L1.id
      JOIN locations AS L2 ON T2.locationId = L2.id
      WHERE L1.subname = ? AND L2.subname = ?
    `,
      [data.departure, data.arrive],
    );
    if (returnRoutes.length === 0) {
      return null;
    }
    const routeIds = returnRoutes.map((route) => route.routeId);

    const filterCoaches = await getManager()
      .createQueryBuilder(Coach, 'coach')
      .innerJoinAndSelect('coach.trips', 'trip')
      .innerJoinAndSelect('coach.type', 'type')
      .where('coach.routeId IN (:...routeIds)', { routeIds: routeIds })
      .andWhere(`trip.tripStatus = 'ready'`)
      .getMany();
    if (filterCoaches.length === 0) {
      return null;
    }

    const returnCoaches = filterCoaches.map((coach) => {
      const name = coach.type.name + ' #' + coach.id;
      return { name: name, ...coach };
    });

    return { routes: returnRoutes, coaches: returnCoaches };
  }

  async getCoachDetail(data: CoachFetchingMess) {
    const returnData = await getManager().query(
      `
      SELECT R.drivingDuration, 
      L1.subname AS departureLocation, 
      L2.subname AS arriveLocation
      FROM coaches AS C
      JOIN routes AS R ON C.routeId = R.id
      JOIN terminals AS T1 ON R.departureId = T1.id
      JOIN terminals AS T2 ON R.arriveId = T2.id
      JOIN locations AS L1 ON T1.locationId = L1.id
      JOIN locations AS L2 ON T2.locationId = L2.id
      WHERE C.id = ? AND C.isAvailable = 1
    `,
      [data.id],
    );

    return returnData[0];
  }

  async getAvailableCoaches(getAvailableCoachesDto: GetAvailableCoachesDto) {
    const { departureDate, routeId, shift } = getAvailableCoachesDto;
    const { drivingDuration } = await Route.findOne(routeId);
    const data = await Coach.find({
      join: {
        alias: 'coach',
        leftJoinAndSelect: {
          trip: 'coach.trips',
        },
      },
      where: {
        routeId: routeId,
        isAvailable: true,
      },
    });
    const filterData = data.filter((coach) => {
      if (coach.trips.length === 0) {
        return true;
      } else {
        const isValidOne = !coach.trips.some((trip) =>
          isDayBetween(departureDate, trip.departureDate, trip.arriveDate),
        );
        const isValidTwo = !coach.trips.some((trip) =>
          isDayBetween(
            dayjs(departureDate)
              .add(shift + drivingDuration, 'hours')
              .startOf('day'),
            trip.departureDate,
            trip.arriveDate,
          ),
        );
        return isValidOne && isValidTwo;
      }
    });

    const returnData = filterData.map((coach) => {
      const name = coach.type.name + ' #' + coach.id;
      return { ...coach, name: name };
    });
    return returnData;
  }

  async getAllRoutes() {
    const data = await getManager().query(`
      SELECT R.id AS routeId, L1.name AS departureLocation, L2.name as arriveLocation, T1.name AS departureTerminal, T2.name AS arriveTerminal, R.drivingDuration 
      FROM routes AS R
      JOIN terminals AS T1 ON R.departureId = T1.id
      JOIN terminals AS T2 ON R.arriveId = T2.id
      JOIN locations AS L1 ON T1.locationId = L1.id
      JOIN locations AS L2 ON T2.locationId = L2.id
      ORDER BY R.id
    `);
    return data;
  }
}
