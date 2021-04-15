import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';
import { DRIVER_SERVICE } from '../constants';
import { DriverController } from './driver.controller';
import { Driver, DriverSchema } from './driver.entity';
import { DriverService } from './driver.service';
import { Location, LocationSchema } from './location.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Driver.name, schema: DriverSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
    ClientsModule.register([
      {
        name: DRIVER_SERVICE,
        transport: Transport.NATS,
        options: {
          url: process.env.NATS_URL,
          queue: DRIVER_SERVICE,
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
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
