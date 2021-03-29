import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Events, StaffCreatedEvent, StaffRoles } from '@quangdvnnnn/go-n-share';
import { Request, Response } from 'express';
import { AUTH_SERVICE } from '../constants';
import {
  CreateStaffResponse,
  LoginResponse,
} from '../constants/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { LogInDto } from './dto/log-in.dto';
import { StaffService } from './staff.service';

const StaffCreated =
  process.env.NODE_ENV === 'production'
    ? Events.StaffCreated
    : Events.StaffCreatedDev;

const logger = new Logger('EventPublish');

@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('/create')
  @HttpCode(201)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SUPERVISING)
  async createStaff(
    @Body(ValidationPipe) createStaffDto: CreateStaffDto,
  ): Promise<CreateStaffResponse> {
    const { username, password, role, fullname, phone } = createStaffDto;
    const newStaff = await this.staffService.createStaff({
      username,
      password,
      role,
    });
    const event: StaffCreatedEvent = {
      id: newStaff.id,
      fullname,
      phone,
      role,
      username,
      workingStatus: newStaff.workingStatus,
    };
    this.client
      .emit<string, StaffCreatedEvent>(StaffCreated, event)
      .subscribe(() => logger.log('Event published successfully...'));
    // this.publisher
    //   .emit<string, StaffCreatedEvent>(StaffCreated, event)
    //   .subscribe((id) => {
    //     console.log('Published message with id:', id);
    //   });
    return {
      success: true,
      data: newStaff,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async logIn(
    @Body(ValidationPipe) logInDto: LogInDto,
    @Req() request: Request,
  ): Promise<LoginResponse> {
    const data = await this.staffService.logIn(logInDto);
    request.session.token = data.token;
    return {
      success: true,
      data: data.token,
    };
  }

  @Delete('/logout')
  @HttpCode(200)
  async logOut(@Req() request: Request, @Res() response: Response) {
    request.session.destroy((err) => {
      if (err) {
        console.log(err);
        return response.status(400).send({ success: false });
      }
      response.clearCookie('qid');
      return response.status(200).send({ success: true });
    });
  }
}
