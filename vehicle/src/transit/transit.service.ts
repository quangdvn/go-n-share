import { Injectable } from '@nestjs/common';
import {
  TransitCreatedEvent,
  TransitStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { getConnection } from 'typeorm';
import { Transit } from './transit.entity';

@Injectable()
export class TransitService {
  constructor() {}

  async createTransit({ transitData }: TransitCreatedEvent) {
    const firstTransit = await Transit.create({
      id: transitData[0].id,
      departureDate: transitData[0].departureDate,
      departureShift: transitData[0].departureShift,
      cabId: transitData[0].cabId,
      tripId: transitData[0].tripId,
    }).save();

    const secondTransit = await Transit.create({
      id: transitData[1].id,
      departureDate: transitData[1].departureDate,
      departureShift: transitData[1].departureShift,
      cabId: transitData[1].cabId,
      tripId: transitData[1].tripId,
    }).save();

    return [firstTransit, secondTransit];
  }

  async updateTransitStatus(data: TransitStatusUpdatedEvent) {
    const returnData = await getConnection()
      .createQueryBuilder()
      .update(Transit)
      .set({ transitStatus: data.status })
      .where('id = :id', { id: data.transitId })
      .execute();
    return returnData;
  }
}
