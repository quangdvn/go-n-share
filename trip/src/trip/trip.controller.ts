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
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import {
  CoachFetchingMess,
  DriverFetchingMess,
  Events,
  Messages,
  RouteFetchingMess,
  StaffRoles,
  TripCreatedEvent,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { TRIP_SERVICE } from '../constants';
import {
  CoachFetchingResponse,
  RouteFetchingResponse,
} from '../constants/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { TripService } from './trip.service';

const CoachFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CoachFetching
    : Messages.CabFetchingDev;

const TripCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TripCreated
    : Events.TripCreatedDev;

const TripStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TripStatusUpdated
    : Events.TripStatusUpdatedDev;

const DriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.DriverFetching
    : Messages.DriverFetchingDev;

const RouteFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.RouteFetching
    : Messages.RouteFetchingDev;

const subLogger = new Logger('EventSubcribe');
const pubLogger = new Logger('EventPublish');

@Controller('trip')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    @Inject(TRIP_SERVICE) private readonly client: ClientProxy,
  ) {}

  @EventPattern(TripStatusUpdated)
  async updateTripStatus(@Payload() data: TripStatusUpdatedEvent) {
    subLogger.log('Event received successfully...');
    return this.tripService.updateTripStatus(data);
  }

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
      .send<CoachFetchingResponse | null, CoachFetchingMess>(
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

    const data = await this.tripService.createTrip(createTripDto, coachData);
    const event: TripCreatedEvent = {
      tripData: [
        {
          id: data[0].id,
          driverId: data[0].driverId,
          coachId: data[0].coachId,
          departureDate: data[0].departureDate,
          departureTime: data[0].departureTime,
          departureLocation: data[0].departureLocation,
          arriveDate: data[0].arriveDate,
          arriveTime: data[0].arriveTime,
          arriveLocation: data[0].arriveLocation,
        },
        {
          id: data[1].id,
          driverId: data[1].driverId,
          coachId: data[1].coachId,
          departureDate: data[1].departureDate,
          departureTime: data[1].departureTime,
          departureLocation: data[1].departureLocation,
          arriveDate: data[1].arriveDate,
          arriveTime: data[1].arriveTime,
          arriveLocation: data[1].arriveLocation,
        },
      ],
    };
    this.client
      .emit<string, TripCreatedEvent>(TripCreated, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: data,
    };
  }

  @Post('/search')
  @HttpCode(200)
  async searchTrip(@Body(ValidationPipe) searchTripDto: SearchTripDto) {
    const routeMessage: RouteFetchingMess = {
      departure: searchTripDto.departure,
      arrive: searchTripDto.arrive,
    };

    const routeData = await this.client
      .send<RouteFetchingResponse, RouteFetchingMess>(
        RouteFetching,
        routeMessage,
      )
      .toPromise();
    if (!routeData.success) {
      throw new BadRequestException('Không tìm thấy chuyến phù hợp');
    }

    const returnData = await this.tripService.searchTrip(
      routeData.data,
      searchTripDto,
    );
    return {
      success: true,
      data: returnData,
    };
  }
}
