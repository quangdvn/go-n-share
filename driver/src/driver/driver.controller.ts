import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
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
  Events,
  IRequest,
  Messages,
  StaffRoles,
  TripCreatedEvent,
  TripStatusUpdatedEvent,
} from '@quangdvnnnn/go-n-share';
import { DRIVER_SERVICE } from '../constants';
import {
  CreateScheduleResponse,
  GetInfoResponse,
} from '../constants/custom-interface';
import { RequireAuthDriverGuard } from '../guards/require-auth-driver.guard';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { DriverService } from './driver.service';
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

const TripStatusUpdated =
  process.env.NODE_ENV === 'production'
    ? Events.TripStatusUpdated
    : Events.TripStatusUpdatedDev;

const DriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.DriverFetching
    : Messages.DriverFetchingDev;

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

  @MessagePattern(DriverFetching)
  async getDriverDetail(@Payload() data: DriverFetchingMess) {
    const res = await this.driverService.getDriverDetail(data.id);
    if (res) {
      return true;
    } else {
      return false;
    }
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

  @Post('/confirm-trip')
  @HttpCode(200)
  @UseGuards(RequireAuthDriverGuard)
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
}
