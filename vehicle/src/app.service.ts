import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getHello(): string {
    // const res = await getRepository(Route)
    //   .createQueryBuilder('route')
    //   .innerJoinAndSelect('route.departure', 'terminal')
    //   .where('terminal.locationId = :id', { id: 1 })
    //   .getMany();

    // return res.map((res) => res.id);
    return 'Welcome to Vehicle Service !!!';
  }
}
