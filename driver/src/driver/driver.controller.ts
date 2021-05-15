import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
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
  DriverCreatedEvent,
  DriverFetchingMess,
  DriverRoles,
  DriverSackedEvent,
  Events,
  IRequest,
  Messages,
  StaffRoles,
  TransitCreatedEvent,
  TransitDriverFetchingMess,
  TransitStatusUpdatedEvent,
  TripCreatedEvent,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { DRIVER_SERVICE } from '../constants';
import {
  CreateScheduleResponse,
  GetInfoResponse,
} from '../constants/custom-interface';
import { DriverRolesGuard } from '../guards/driver-roles.guard';
import { RequireAuthDriverGuard } from '../guards/require-auth-driver.guard';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { DriverService } from './driver.service';
import { ConfirmTransitDto } from './dto/confirm-transit.dto';
import { ConfirmTripDto } from './dto/confirm-trip.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetAvailableDriversDto } from './dto/get-avai-drivers.dto';

const DriverCreated =
  process.env.NODE_ENV === 'production'
    ? Events.DriverCreated
    : Events.DriverCreatedDev;

const TripCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TripCreated
    : Events.TripCreatedDev;

const TransitCreated =
  process.env.NODE_ENV === 'production'
    ? Events.TransitCreated
    : Events.TransitCreatedDev;

const TripStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TripStatusUpdated
    : Events.TripStatusUpdatedDev;

const TransitStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TransitStatusUpdated
    : Events.TransitStatusUpdatedDev;

const DriverSacked =
  process.env.NODE_ENV === 'production'
    ? Events.DriverSacked
    : Events.DriverSackedDev;

const DriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.DriverFetching
    : Messages.DriverFetchingDev;

const TransitDriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitDriverFetching
    : Messages.TransitDriverFetchingDev;

const subLogger = new Logger('EventSubcribe');
const pubLogger = new Logger('EventPublish');

@Controller('/driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    @Inject(DRIVER_SERVICE) private readonly client: ClientProxy,
  ) {}

  @EventPattern(DriverCreated)
  async createDriver(@Payload() data: DriverCreatedEvent) {
    subLogger.log('Event received successfully...');
    return this.driverService.createDriver(data);
  }

  @EventPattern(TripCreated)
  async addTrip(@Payload() data: TripCreatedEvent) {
    subLogger.log('Event received successfully...');
    return this.driverService.addTrip(data);
  }

  @EventPattern(TransitCreated)
  async addTransit(@Payload() data: TransitCreatedEvent) {
    subLogger.log('Event received successfully...');
    return this.driverService.addTransit(data);
  }

  @MessagePattern(DriverFetching)
  async getDriverDetail(@Payload() data: DriverFetchingMess) {
    const res = await this.driverService.getDriverDetail(data.id);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  @MessagePattern(TransitDriverFetching)
  async getTransitDrivers(@Payload() data: TransitDriverFetchingMess) {
    const res = await this.driverService.getTransitDrivers(data);
    return res;
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SUPERVISING)
  async getAllDrivers() {
    const res = await this.driverService.getAllDrivers();
    return {
      success: true,
      data: res,
    };
  }

  @Post('/available-schedule')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SCHEDULING)
  async getAvailableDrivers(
    @Body(ValidationPipe) getAvailableDriversDto: GetAvailableDriversDto,
  ) {
    const data = await this.driverService.getAvailableDrivers(
      getAvailableDriversDto,
    );
    if (data.length > 0) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        data: [],
      };
    }
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(RequireAuthDriverGuard)
  async getDriverInfo(@Req() req: IRequest): Promise<GetInfoResponse> {
    const driverId = (req.currentUser.data.id as unknown) as number;
    const data = await this.driverService.getDriverInfo(driverId);
    return {
      success: true,
      data: data,
    };
  }

  @Post('/confirm-fixed-trip')
  @HttpCode(200)
  @UseGuards(RequireAuthDriverGuard, DriverRolesGuard)
  @Roles(DriverRoles.FIXED_TRIP)
  async confirmTripStatus(
    @Req() req: IRequest,
    @Body(ValidationPipe) confirmTripDto: ConfirmTripDto,
  ) {
    const driverId = req.currentUser.data.id;
    const { driver } = await this.driverService.confirmTripStatus(
      confirmTripDto,
      driverId,
    );

    const event: TripStatusUpdatedEvent = {
      driverId: driverId,
      tripId: confirmTripDto.tripId,
      status: confirmTripDto.status,
    };

    this.client
      .emit<string, TripStatusUpdatedEvent>(TripStatusUpdated, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: driver,
    };
  }

  @Post('/confirm-transit-trip')
  @HttpCode(200)
  @UseGuards(RequireAuthDriverGuard, DriverRolesGuard)
  @Roles(DriverRoles.TRANSIT_TRIP)
  async confirmTransitStatus(
    @Req() req: IRequest,
    @Body(ValidationPipe) confirmTransitDto: ConfirmTransitDto,
  ) {
    const driverId = req.currentUser.data.id;
    const { driver } = await this.driverService.confirmTransitStatus(
      confirmTransitDto,
      driverId,
    );

    const event: TransitStatusUpdatedEvent = {
      driverId: driverId,
      transitId: confirmTransitDto.transitId,
      status: confirmTransitDto.status,
    };

    this.client
      .emit<string, TransitStatusUpdatedEvent>(TransitStatusUpdated, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: driver,
    };
  }

  @Post('/update-schedule')
  @HttpCode(201)
  @UseGuards(RequireAuthDriverGuard)
  async createSchedule(
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
    @Req() req: IRequest,
  ): Promise<CreateScheduleResponse> {
    const driverId = (req.currentUser.data.id as unknown) as number;
    const data = await this.driverService.createSchedule(
      createScheduleDto,
      driverId,
    );
    return {
      success: true,
      data: data,
    };
  }

  @Post('/sacking/:id')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SUPERVISING)
  async sackDriver(@Param('id', ParseIntPipe) driverId: number) {
    const res = await this.driverService.sackDriver(driverId);

    const event: DriverSackedEvent = {
      driverId: driverId,
    };

    this.client
      .emit<string, DriverSackedEvent>(DriverSacked, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: res,
    };
  }
}
