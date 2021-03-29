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
import { ClientProxy } from '@nestjs/microservices';
import {
  DriverCreatedEvent,
  Events,
  StaffRoles,
} from '@quangdvnnnn/go-n-share';
import { AUTH_SERVICE } from '../constants';
import {
  CreateDriverResponse,
  LoginResponse,
} from '../constants/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { LogInDto } from './dto/log-in.dto';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver';

const DriverCreated =
  process.env.NODE_ENV === 'production'
    ? Events.DriverCreated
    : Events.DriverCreatedDev;

const logger = new Logger('EventPublish');

@Controller('driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    @Inject(AUTH_SERVICE) private client: ClientProxy,
  ) {}

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
      .subscribe(() => logger.log('Event published successfully...'));

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
