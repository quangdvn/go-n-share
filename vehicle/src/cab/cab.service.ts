import { Injectable } from '@nestjs/common';
import { TransitCabFetchingMess } from '@quangdvnnnn/go-n-share';
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
}
