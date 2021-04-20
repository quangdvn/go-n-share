import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  Events,
  TransitCreatedEvent,
  TransitStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { TransitService } from './transit.service';

const TransitCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TransitCreated
    : Events.TransitCreatedDev;

const TransitStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TransitStatusUpdated
    : Events.TransitStatusUpdatedDev;

const subLogger = new Logger('EventSubcribe');

@Controller('transit')
export class TransitController {
  constructor(private readonly transitService: TransitService) {}

  @EventPattern(TransitCreated)
  async createTrip(@Payload() data: TransitCreatedEvent) {
    subLogger.log('Event received successfully...');
    return this.transitService.createTransit(data);
  }

  @EventPattern(TransitStatusUpdated)
  async updateTripStatus(@Payload() data: TransitStatusUpdatedEvent) {
    subLogger.log('Event received successfully...');
    return this.transitService.updateTransitStatus(data);
  }
}
