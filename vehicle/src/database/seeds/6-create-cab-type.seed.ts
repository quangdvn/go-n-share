import { VehicleType as CabTypeEnum } from '@quangdvnnnn/go-n-share';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { CabType } from '../../cab/cab-type.entity';

export default class CreateCabType implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CabType)
      .values([
        {
          seatNumber: 7,
          name: CabTypeEnum.SMALL,
        },
        {
          seatNumber: 10,
          name: CabTypeEnum.MEDIUM,
        },
        {
          seatNumber: 15,
          name: CabTypeEnum.LARGE,
        },
      ])
      .execute();
  }
}
