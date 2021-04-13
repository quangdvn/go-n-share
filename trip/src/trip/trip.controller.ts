import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Logger,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CoachFetchingMess,
  DriverFetchingMess,
  Events,
  Messages,
  StaffRoles,
  TripCreatedEvent,
} from '@quangdvnnnn/go-n-share';
import { TRIP_SERVICE } from '../constants';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { TripService } from './trip.service';

const CoachFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CoachFetching
    : Messages.CabFetchingDev;

const TripCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TripCreated
    : Events.TripCreatedDev;

const DriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.DriverFetching
    : Messages.DriverFetchingDev;

const logger = new Logger('EventPublish');

@Controller('trip')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    @Inject(TRIP_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SCHEDULING)
  async createTrip(@Body(ValidationPipe) createTripDto: CreateTripDto) {
    const coachMessage: CoachFetchingMess = {
      id: createTripDto.coachId,
      shift: createTripDto.shift,
      departureDate: createTripDto.departureDate,
    };

    const coachData = await this.client
      .send<{ drivingDuration: number } | null, CoachFetchingMess>(
        CoachFetching,
        coachMessage,
      )
      .toPromise();
    if (!coachData) {
      throw new BadRequestException('Xe không tồn tại');
    }

    const driverMessage: DriverFetchingMess = {
      id: createTripDto.driverId,
      shift: createTripDto.shift,
      departureDate: createTripDto.departureDate,
    };

    const driverData = await this.client
      .send<boolean, DriverFetchingMess>(DriverFetching, driverMessage)
      .toPromise();

    if (!driverData) {
      throw new BadRequestException('Tài xế không tồn tại');
    }

    const data = await this.tripService.createTrip(
      createTripDto,
      coachData.drivingDuration,
    );
    const event: TripCreatedEvent = {
      tripData: [
        {
          id: data[0].id,
          driverId: data[0].driverId,
          coachId: data[0].coachId,
          departureDate: data[0].departureDate,
          departureTime: data[0].departureTime,
          arriveDate: data[0].arriveDate,
          arriveTime: data[0].arriveTime,
        },
        {
          id: data[1].id,
          driverId: data[1].driverId,
          coachId: data[1].coachId,
          departureDate: data[1].departureDate,
          departureTime: data[1].departureTime,
          arriveDate: data[1].arriveDate,
          arriveTime: data[1].arriveTime,
        },
      ],
    };
    this.client
      .emit<string, TripCreatedEvent>(TripCreated, event)
      .subscribe(() => logger.log('Event published successfully...'));

    return {
      success: true,
      data: data,
    };
  }
}
