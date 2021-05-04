import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import {
  AllTripFetchingMess,
  BookingVerifiedEvent,
  CoachDetailFetchingMess,
  CoachFetchingMess,
  DriverFetchingMess,
  Events,
  Messages,
  RouteFetchingMess,
  SeatCoachFetchingMess,
  StaffRoles,
  TripCreatedEvent,
  TripFetchingMess,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { TRIP_SERVICE } from '../constants';
import {
  CoachFetchingResponse,
  RouteFetchingResponse,
  TripBookingFetchingMess,
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
    : Messages.CoachFetchingDev;

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

const TripFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TripFetching
    : Messages.TripFetchingDev;

const SeatCoachFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.SeatCoachFetching
    : Messages.SeatCoachFetchingDev;

const AllTripFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.AllTripFetching
    : Messages.AllTripFetchingDev;

const TripBookingFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TripBookingFetching
    : Messages.TripBookingFetchingDev;

const CoachDetailFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CoachDetailFetching
    : Messages.CoachDetailFetchingDev;

const BookingVerified =
  process.env.NODE_ENV === 'production'
    ? Events.BookingVerified
    : Events.BookingVerifiedDev;

const subLogger = new Logger('EventSubcribe');
const pubLogger = new Logger('EventPublish');

@Controller('trip')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    @Inject(TRIP_SERVICE) private readonly client: ClientProxy,
  ) {}

  @MessagePattern(TripFetching)
  async tripFetching(@Payload() data: TripFetchingMess) {
    const res = await this.tripService.tripFetching(data);
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

  @EventPattern(BookingVerified)
  async updateTripBooking(@Payload() data: BookingVerifiedEvent) {
    subLogger.log('12Event received successfully...');
    console.log('1', data);
    if (data.isCancel && !data.hasTransit) {
      return true;
    } else {
      const coach = await this.tripService.getTripCoach(data.tripId);
      const coachMess: SeatCoachFetchingMess = {
        coachId: coach,
      };

      const coachData = await this.client
        .send<{ success: false; data: number | null }, SeatCoachFetchingMess>(
          SeatCoachFetching,
          coachMess,
        )
        .toPromise();

      if (!coachData.success) {
        throw new BadRequestException('Loại xe không tồn tại');
      }

      return this.tripService.updateTripBooking(data, coachData.data);
    }
  }

  @EventPattern(TripStatusUpdated)
  async updateTripStatus(@Payload() data: TripStatusUpdatedEvent) {
    subLogger.log('Event received successfully...');

    return this.tripService.updateTripStatus(data);
  }

  @MessagePattern(AllTripFetching)
  async allTripFetching(@Payload() data: AllTripFetchingMess) {
    const res = await this.tripService.allTripFetching(data);
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
  async getTrip(@Param('id', ParseIntPipe) id: number) {
    const res = await this.tripService.getTrip(id);
    const bookingMess: TripBookingFetchingMess = {
      tripId: res.id,
    };

    const bookingData = await this.client
      .send<any, TripBookingFetchingMess>(TripBookingFetching, bookingMess)
      .toPromise();

    const coachMess: CoachDetailFetchingMess = {
      id: res.coachId,
    };

    const coachData = await this.client
      .send<any, CoachDetailFetchingMess>(CoachDetailFetching, coachMess)
      .toPromise();

    return {
      success: true,
      data: { ...res, bookings: [...bookingData], ...coachData },
    };
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
