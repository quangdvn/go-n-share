import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Location } from '../../common/location.entity';
import { Location as LocationEnum } from '@quangdvnnnn/go-n-share';

export default class CreateLocation implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values([
        {
          name: LocationEnum.HANOI,
          subname: LocationEnum.HANOI_SUBNAME,
        },
        {
          name: LocationEnum.QUANGNINH,
          subname: LocationEnum.QUANGNINH_SUBNAME,
        },
        {
          name: LocationEnum.DANANG,
          subname: LocationEnum.DANANG_SUBNAME,
        },
        {
          name: LocationEnum.HOCHIMINH,
          subname: LocationEnum.HOCHIMINH_SUBNAME,
        },
      ])
      .execute();
  }
}
