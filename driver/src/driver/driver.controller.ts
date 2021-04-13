import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  DriverCreatedEvent,
  DriverFetchingMess,
  Events,
  IRequest,
  Messages,
  StaffRoles,
  TripCreatedEvent,
} from '@quangdvnnnn/go-n-share';
import {
  CreateScheduleResponse,
  GetInfoResponse,
} from '../constants/custom-interface';
import { RequireAuthDriverGuard } from '../guards/require-auth-driver.guard';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { DriverService } from './driver.service';
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

const DriverFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.DriverFetching
    : Messages.DriverFetchingDev;

const logger = new Logger('EventSubcribe');

@Controller('/schedule')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @EventPattern(DriverCreated)
  async createDriver(@Payload() data: DriverCreatedEvent) {
    logger.log('Event received successfully...');
    return this.driverService.createDriver(data);
  }

  @EventPattern(TripCreated)
  async addTrip(@Payload() data: TripCreatedEvent) {
    logger.log('Event received successfully...');
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

  @Post('/available')
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

  @Post('/')
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
