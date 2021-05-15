import {
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
} from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import {
  Events,
  IRequest,
  StaffCreatedEvent,
  StaffSackedEvent,
  StaffRoles,
} from '@quangdvnnnn/go-n-share';
import { STAFF_SERVICE } from '../constants';
import { GetInfoResponse } from '../constants/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { StaffService } from './staff.service';

const StaffCreated =
  process.env.NODE_ENV === 'production'
    ? Events.StaffCreated
    : Events.StaffCreatedDev;

const StaffSacked =
  process.env.NODE_ENV === 'production'
    ? Events.StaffSacked
    : Events.StaffSackedDev;

// const subLogger = new Logger('EventSubcribe');
const pubLogger = new Logger('EventPublish');

@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    @Inject(STAFF_SERVICE) private client: ClientProxy,
  ) {}

  @EventPattern(StaffCreated)
  async createStaff(@Payload() data: StaffCreatedEvent) {
    return this.staffService.createStaff(data);
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SUPERVISING)
  async getAllSfaff() {
    const data = await this.staffService.getAllSfaff();
    return {
      success: true,
      data: data,
    };
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard)
  async getStaffInfo(@Req() req: IRequest): Promise<GetInfoResponse> {
    const staffId = (req.currentUser.data.id as unknown) as number;
    const data = await this.staffService.getStaffInfo(staffId);
    return {
      success: true,
      data: data,
    };
  }

  @Post('/sacking/:id')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SUPERVISING)
  async sackStaff(@Param('id', ParseIntPipe) staffId: number) {
    const res = await this.staffService.sackStaff(staffId);

    const event: StaffSackedEvent = {
      staffId: staffId,
    };

    this.client
      .emit<string, StaffSackedEvent>(StaffSacked, event)
      .subscribe(() => pubLogger.log('Event published successfully...'));

    return {
      success: true,
      data: res,
    };
  }
}
