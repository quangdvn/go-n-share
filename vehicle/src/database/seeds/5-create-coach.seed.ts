import { Connection, getRepository } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Coach } from '../../coach/coach.entity';
import { Route } from '../../common/route.entity';
import { getRand } from '../../utils';

export default class CreateCoach implements Seeder {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Coach)()
      .map(async (coach: Coach) => {
        const locationId = coach.locationId;
        const res = await getRepository(Route)
          .createQueryBuilder('route')
          .innerJoin('route.departure', 'terminal')
          .where('terminal.locationId = :id', { id: locationId })
          .getMany();

        const routeIds = res.map((res) => res.id);
        const routeId = getRand<number>(routeIds);
        coach.routeId = routeId;
        return coach;
      })
      .createMany(100);
  }
}
