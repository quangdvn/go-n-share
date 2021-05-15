import {
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
  DriverCreatedEvent,
  DriverSackedEvent,
  Events,
  StaffRoles,
} from '@quangdvnnnn/go-n-share';
import { AUTH_SERVICE } from '../constants';
import { CreateDriverResponse } from '../constants/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver';
import { LogInDto } from './dto/log-in.dto';

const DriverCreated =
  process.env.NODE_ENV === 'production'
    ? Events.DriverCreated
    : Events.DriverCreatedDev;

const DriverSacked =
  process.env.NODE_ENV === 'production'
    ? Events.DriverSacked
    : Events.DriverSackedDev;

const subLogger = new Logger('EventSubcribe');
const pubLogger = new Logger('EventPublish');

@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    @Inject(AUTH_SERVICE) private client: ClientProxy,
  ) {}

  @EventPattern(DriverSacked)
  async sackDriver(@Payload() data: DriverSackedEvent) {
    subLogger.log('Event received successfully...');
    return this.driverService.sackDriver(data);
  }

  @Post('/create')
  @HttpCode(201)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SCHEDULING)
  async createDriver(
    @Body(ValidationPipe) createDriverDto: CreateDriverDto,
  ): Promise<CreateDriverResponse> {
    const {
      username,
      password,
      role,
      age,
      fullname,
      location,
      phone,
    } = createDriverDto;
    const newDriver = await this.driverService.createDriver({
      username,
      password,
      role,
      phone,
    });

    const event: DriverCreatedEvent = {
      id: newDriver.id,
      age,
      fullname,
      location,
      phone,
      role,
      username,
      workingStatus: newDriver.workingStatus,
    };
    this.client
      .emit<string, DriverCreatedEvent>(DriverCreated, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: newDriver,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async logIn(@Body(ValidationPipe) logInDto: LogInDto) {
    const data = await this.driverService.logIn(logInDto);
    // request.session.token = data.token;
    return {
      success: true,
      data: data.token,
    };
  }

  // @Delete('/logout')
  // @HttpCode(200)
  // async logOut(@Req() request: Request, @Res() response: Response) {
  //   request.session.destroy((err) => {
  //     if (err) {
  //       console.log(err);
  //       return response.status(400).send({ success: false });
  //     }
  //     response.clearCookie('qid');
  //     return response.status(200).send({ success: true });
  //   });
  // }
}
