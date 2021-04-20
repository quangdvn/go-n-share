import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRIP_SERVICE } from '../constants';
import { TransitController } from './transit.controller';
import { TransitService } from './transit.service';

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
  controllers: [TransitController],
  providers: [TransitService],
})
export class TransitModule {}
