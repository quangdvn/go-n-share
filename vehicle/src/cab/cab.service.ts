import { Injectable } from '@nestjs/common';
import {
  CabFetchingMess,
  TransitCabFetchingMess,
} from '@quangdvnnnn/go-n-share';
import { getManager } from 'typeorm';
import { Cab } from './cab.entity';

@Injectable()
export class CabService {
  constructor() {}

  async getTransitCabs(data: TransitCabFetchingMess) {
    const rawCabs = await getManager()
      .createQueryBuilder(Cab, 'cab')
      .innerJoinAndSelect('cab.location', 'location')
      .where('location.subname = :location', { location: data.location })
      .orderBy('cab.id')
      .select(['cab.id'])
      .getMany();

    const rawUnavailableCabs = await getManager()
      .createQueryBuilder(Cab, 'cab')
      .innerJoinAndSelect('cab.transits', 'transit')
      .innerJoinAndSelect('cab.location', 'location')
      .where('location.subname = :location', { location: data.location })
      .andWhere('transit.departureDate = :date', { date: data.date })
      .andWhere(`transit.departureShift = :shift`, { shift: data.shift })
      .orderBy('cab.id')
      .select(['cab.id'])
      .getMany();
    console.log(rawUnavailableCabs);

    const filterCabs = rawCabs.map((cab) => cab.id);

    const filterUnavailableCabs = rawUnavailableCabs.map((cab) => cab.id);

    const res = filterCabs.filter((id) => !filterUnavailableCabs.includes(id));

    return res;
  }

  async getTransitCab(data: CabFetchingMess) {
    const firstRes = await getManager().query(
      `
      SELECT C.id as cabId, C.numberPlate, CT.seatNumber, 
      CT.name AS cabName 
      FROM cabs AS C
      JOIN cabTypes AS CT ON C.typeId = CT.id
      WHERE C.id = ?
    `,
      [data.cabId],
    );

    const secondRes = await getManager().query(
      `
      SELECT R.id as routeId, R.drivingDuration, R.basePrice, 
      T1.name AS departureTerminal, T1.address AS departureAddress, 
      T1.latitude AS departureLatitude, T1.longitude AS departureLongitude,
      L1.id AS departureId, L1.name AS departureName, L1.subName AS departureSubName,
      T2.name AS arriveTerminal, T2.address AS arriveAddress,
      T2.latitude AS arriveLatitude, T2.longitude AS arriveLongitude, 
      L2.id AS arriveId, L2.name AS arriveName, L2.subName AS arriveSubName
      FROM routes AS R
      JOIN coaches AS C ON C.routeId = R.id
      JOIN terminals AS T1 ON R.departureId = T1.id
      JOIN terminals AS T2 ON R.arriveId = T2.id
      JOIN locations AS L1 ON T1.locationId = L1.id
      JOIN locations AS L2 ON T2.locationId = L2.id
      JOIN trips AS TR ON TR.coachId = C.id
      WHERE TR.id = ?
    `,
      [data.tripId],
    );

    return { ...firstRes[0], ...secondRes[0] };
  }

  // async gettTransitCab(cabId: number, tripId: number) {
  //   const firstRes = await getManager().query(
  //     `
  //     SELECT C.id as cabId, C.numberPlate, CT.seatNumber,
  //     CT.name AS cabName
  //     FROM cabs AS C
  //     JOIN cabTypes AS CT ON C.typeId = CT.id
  //     WHERE C.id = ?
  //   `,
  //     [cabId],
  //   );

  //   const secondRes = await getManager().query(
  //     `
  //     SELECT R.id as routeId, R.drivingDuration, R.basePrice,
  //     T1.name AS departureTerminal, T1.address AS departureAddress,
  //     T1.latitude AS departureLatitude, T1.longitude AS departureLongitude,
  //     L1.id AS departureId, L1.name AS departureName, L1.subName AS departureSubName,
  //     T2.name AS arriveTerminal, T2.address AS arriveAddress,
  //     T2.latitude AS arriveLatitude, T2.longitude AS arriveLongitude,
  //     L2.id AS departureId, L2.name AS departureName, L2.subName AS departureSubName,
  //     TR.id AS fixedTripId
  //     FROM routes AS R
  //     JOIN coaches AS C ON C.routeId = R.id
  //     JOIN terminals AS T1 ON R.departureId = T1.id
  //     JOIN terminals AS T2 ON R.arriveId = T2.id
  //     JOIN locations AS L1 ON T1.locationId = L1.id
  //     JOIN locations AS L2 ON T2.locationId = L2.id
  //     JOIN trips AS TR ON TR.coachId = C.id
  //     WHERE TR.id = ?
  //   `,
  //     [tripId],
  //   );

  //   return { firstData: { ...firstRes[0] }, secondeData: { ...secondRes[0] } };
  // }
}
