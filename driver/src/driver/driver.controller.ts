import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DriverCreatedEvent, Events, IRequest } from '@quangdvnnnn/go-n-share';
import {
  CreateScheduleResponse,
  GetInfoResponse,
} from '../constants/custom-interface';
import { RequireAuthDriverGuard } from '../guards/require-auth-driver.guard';
import { DriverService } from './driver.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

const DriverCreated =
  process.env.NODE_ENV === 'production'
    ? Events.DriverCreated
    : Events.DriverCreatedDev;

@Controller('/schedule')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @EventPattern(DriverCreated)
  async createDriver(@Payload() data: DriverCreatedEvent) {
    return this.driverService.createDriver(data);
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
