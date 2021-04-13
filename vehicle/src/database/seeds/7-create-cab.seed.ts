import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Cab } from '../../cab/cab.entity';

export default class CreateCab implements Seeder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Cab)().createMany(100);
  }
}
