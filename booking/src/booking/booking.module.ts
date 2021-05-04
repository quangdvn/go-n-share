import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';
import { BOOKING_SERVICE } from '../constant';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: BOOKING_SERVICE,
        transport: Transport.NATS,
        options: {
          url: process.env.NATS_URL,
          queue: BOOKING_SERVICE,
        },
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
