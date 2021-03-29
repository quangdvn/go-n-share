import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Events, IRequest, StaffCreatedEvent } from '@quangdvnnnn/go-n-share';
import { GetInfoResponse } from '../constants/custom-interface';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { StaffService } from './staff.service';

const StaffCreated =
  process.env.NODE_ENV === 'production'
    ? Events.StaffCreated
    : Events.StaffCreatedDev;

@Controller('me')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @EventPattern(StaffCreated)
  async createStaff(@Payload() data: StaffCreatedEvent) {
    return this.staffService.createStaff(data);
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard)
  async getDriverInfo(@Req() req: IRequest): Promise<GetInfoResponse> {
    const staffId = (req.currentUser.data.id as unknown) as number;
    const data = await this.staffService.getStaffInfo(staffId);
    return {
      success: true,
      data: data,
    };
  }
}
