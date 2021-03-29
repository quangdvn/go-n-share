import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';
import { AUTH_SERVICE } from '../constants';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.NATS,
        options: {
          url: process.env.NATS_URL,
          queue: AUTH_SERVICE,
        },
      },
    ]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*/create',
      method: RequestMethod.POST,
    });
  }
}
