import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRIP_SERVICE } from '../constants';
import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TRIP_SERVICE,
        transport: Transport.NATS,
        options: {
          url: process.env.NATS_URL,
          queue: TRIP_SERVICE,
        },
      },
    ]),
  ],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
