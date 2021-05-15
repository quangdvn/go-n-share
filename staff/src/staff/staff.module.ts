import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';
import { STAFF_SERVICE } from '../constants';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: STAFF_SERVICE,
        transport: Transport.NATS,
        options: {
          url: process.env.NATS_URL,
          queue: STAFF_SERVICE,
        },
      },
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffService],
})
export class StaffModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
