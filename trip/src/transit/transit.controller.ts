import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {
  CabFetchingMess,
  Events,
  Messages,
  TransitCabFetchingMess,
  TransitCreatedEvent,
  TransitDetailCreatingMess,
  TransitDriverFetchingMess,
  TransitStatusUpdatedEvent,
  TripCreatedEvent,
} from '@quangdvnnnn/go-n-share';
import { TRIP_SERVICE } from '../constants';
import { TransitService } from './transit.service';

const TripCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TripCreated
    : Events.TripCreatedDev;

const TransitCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TransitCreated
    : Events.TransitCreatedDev;

const TransitCabFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitCabFetching
    : Messages.TransitCabFetchingDev;

const TransitDriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDriverFetching
    : Messages.TransitDriverFetchingDev;

const TransitStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TransitStatusUpdated
    : Events.TransitStatusUpdatedDev;

const TransitDetailCreating =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDetailCreating
    : Messages.TransitDetailCreatingDev;

const TransitDetailFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDetailFetching
    : Messages.TransitDetailFetchingDev;

const CabFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CabFetching
    : Messages.CabFetchingDev;

const pubLogger = new Logger('EventPublish');
const subLogger = new Logger('EventSubcribe');

@Controller('transit')
export class TransitController {
  constructor(
    private readonly transitService: TransitService,
    @Inject(TRIP_SERVICE) private readonly client: ClientProxy,
  ) {}

  @EventPattern(TripCreated)
  async createTransit(@Payload() data: TripCreatedEvent) {
    const firstTransitMessage: TransitCabFetchingMess = {
      date: data.tripData[0].departureDate,
      location: data.tripData[0].departureLocation,
      shift: data.tripData[0].departureTime,
    };

    const secondTransitMessage: TransitCabFetchingMess = {
      date: data.tripData[1].departureDate,
      location: data.tripData[1].departureLocation,
      shift: data.tripData[1].departureTime,
    };

    const firstTransitData = await this.client
      .send<number[], TransitCabFetchingMess>(
        TransitCabFetching,
        firstTransitMessage,
      )
      .toPromise();

    const secondTransitData = await this.client
      .send<number[], TransitCabFetchingMess>(
        TransitCabFetching,
        secondTransitMessage,
      )
      .toPromise();

    if (firstTransitData.length === 0 || secondTransitData.length === 0) {
      throw new BadRequestException('Xe không tồn tại');
    }

    const firstTransitDriverMessage: TransitDriverFetchingMess = {
      date: data.tripData[0].departureDate,
      location: data.tripData[0].departureLocation,
      shift: data.tripData[0].departureTime,
    };

    const secondTransitDriverMessage: TransitDriverFetchingMess = {
      date: data.tripData[1].departureDate,
      location: data.tripData[1].departureLocation,
      shift: data.tripData[1].departureTime,
    };

    const firstTransitDriverData = await this.client
      .send<number[], TransitCabFetchingMess>(
        TransitDriverFetching,
        firstTransitDriverMessage,
      )
      .toPromise();

    const secondTransitDriverData = await this.client
      .send<number[], TransitCabFetchingMess>(
        TransitDriverFetching,
        secondTransitDriverMessage,
      )
      .toPromise();

    if (
      firstTransitDriverData.length === 0 ||
      secondTransitDriverData.length === 0
    ) {
      throw new BadRequestException('Tài xế không tồn tại');
    }

    const returnData = await this.transitService.createTransit(
      data,
      firstTransitData,
      firstTransitDriverData,
      secondTransitData,
      secondTransitDriverData,
    );

    const event: TransitCreatedEvent = {
      transitData: [
        {
          id: returnData[0].id,
          tripId: returnData[0].tripId,
          cabId: returnData[0].cabId,
          driverId: returnData[0].driverId,
          departureDate: returnData[0].departureDate,
          departureLocation: data.tripData[0].departureLocation,
          departureShift: returnData[0].departureShift,
        },
        {
          id: returnData[1].id,
          tripId: returnData[1].tripId,
          cabId: returnData[1].cabId,
          driverId: returnData[1].driverId,
          departureDate: returnData[1].departureDate,
          departureLocation: data.tripData[1].departureLocation,
          departureShift: returnData[1].departureShift,
        },
      ],
    };

    this.client
      .emit<string, TransitCreatedEvent>(TransitCreated, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: returnData,
    };
  }

  @EventPattern(TransitStatusUpdated)
  async updateTransitStatus(@Payload() data: TransitStatusUpdatedEvent) {
    subLogger.log('Event received successfully...');
    return this.transitService.updateTransitStatus(data);
  }

  @MessagePattern(TransitDetailCreating)
  async createTransitDetail(@Payload() data: TransitDetailCreatingMess) {
    const res = await this.transitService.createTransitDetail(data);
    if (res) {
      return {
        success: true,
        data: res.id,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  }

  @MessagePattern(TransitDetailFetching)
  async transitDetailFetching() {
    const res = await this.transitService.transitDetailFetching();
    if (res) {
      return {
        success: true,
        data: res,
      };
    } else {
      return {
        success: false,
        data: null,
      };
    }
  }

  @Get(':id')
  async getTransit(@Param('id', ParseIntPipe) id: number) {
    const res = await this.transitService.getTransit(id);

    const cabMess: CabFetchingMess = {
      cabId: res.cabId,
      tripId: res.tripId,
    };

    const cabData = await this.client
      .send<any, CabFetchingMess>(CabFetching, cabMess)
      .toPromise();

    return {
      success: true,
      data: { ...res, ...cabData.data },
    };
  }
}
