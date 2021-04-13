import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Route } from '../../common/route.entity';

export default class CreateRoute implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Route)
      .values([
        {
          drivingDuration: 3,
          basePrice: 100000,
          departureId: 1,
          arriveId: 6,
        },
        {
          drivingDuration: 3,
          basePrice: 100000,
          departureId: 6,
          arriveId: 1,
        },
        {
          drivingDuration: 13,
          basePrice: 450000,
          departureId: 2,
          arriveId: 7,
        },
        {
          drivingDuration: 13,
          basePrice: 450000,
          departureId: 7,
          arriveId: 2,
        },
        {
          drivingDuration: 34,
          basePrice: 700000,
          departureId: 2,
          arriveId: 9,
        },
        {
          drivingDuration: 34,
          basePrice: 700000,
          departureId: 9,
          arriveId: 2,
        },
        {
          drivingDuration: 13,
          basePrice: 450000,
          departureId: 3,
          arriveId: 7,
        },
        {
          drivingDuration: 13,
          basePrice: 450000,
          departureId: 7,
          arriveId: 3,
        },
        {
          drivingDuration: 34,
          basePrice: 700000,
          departureId: 3,
          arriveId: 9,
        },
        {
          drivingDuration: 34,
          basePrice: 700000,
          departureId: 9,
          arriveId: 3,
        },
        {
          drivingDuration: 3,
          basePrice: 100000,
          departureId: 4,
          arriveId: 6,
        },
        {
          drivingDuration: 3,
          basePrice: 100000,
          departureId: 6,
          arriveId: 4,
        },
        {
          drivingDuration: 17,
          basePrice: 500000,
          departureId: 5,
          arriveId: 7,
        },
        {
          drivingDuration: 17,
          basePrice: 500000,
          departureId: 7,
          arriveId: 5,
        },
        {
          drivingDuration: 37,
          basePrice: 800000,
          departureId: 5,
          arriveId: 9,
        },
        {
          drivingDuration: 37,
          basePrice: 800000,
          departureId: 9,
          arriveId: 5,
        },
        {
          drivingDuration: 20,
          basePrice: 600000,
          departureId: 8,
          arriveId: 10,
        },
        {
          drivingDuration: 20,
          basePrice: 600000,
          departureId: 10,
          arriveId: 8,
        },
      ])
      .execute();
  }
}
