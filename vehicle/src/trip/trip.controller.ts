import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  Events,
  TripCreatedEvent,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { TripService } from './trip.service';

const TripCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TripCreated
    : Events.TripCreatedDev;

const TripStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TripStatusUpdated
    : Events.TripStatusUpdatedDev;

const logger = new Logger('EventSubcribe');

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @EventPattern(TripStatusUpdated)
  async updateTripStatus(@Payload() data: TripStatusUpdatedEvent) {
    logger.log('Event received successfully...');
    return this.tripService.updateTripStatus(data);
  }

  @EventPattern(TripCreated)
  async createTrip(@Payload() data: TripCreatedEvent) {
    logger.log('Event received successfully...');
    return this.tripService.createTrip(data);
  }
}
