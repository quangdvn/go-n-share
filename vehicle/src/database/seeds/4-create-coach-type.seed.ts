import { VehicleType as CoachTypeEnum } from '@quangdvnnnn/go-n-share';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { CoachType } from '../../coach/coach-type.entity';

export default class CreateCoachType implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CoachType)
      .values([
        {
          seatNumber: 30,
          name: CoachTypeEnum.SMALL,
        },
        {
          seatNumber: 40,
          name: CoachTypeEnum.MEDIUM,
        },
        {
          seatNumber: 50,
          name: CoachTypeEnum.LARGE,
        },
      ])
      .execute();
  }
}
