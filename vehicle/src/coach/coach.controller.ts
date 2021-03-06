import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CoachDetailFetchingMess,
  CoachFetchingMess,
  Messages,
  RouteFetchingMess,
  SeatCoachFetchingMess,
  StaffRoles,
} from '@quangdvnnnn/go-n-share';
import { RequireAuthStaffGuard } from '../guards/require-auth-staff.guard';
import { Roles } from '../guards/roles.decorator';
import { StaffRolesGuard } from '../guards/staff-roles.guard';
import { CoachService } from './coach.service';
import { GetAvailableCoachesDto } from './dto/get-avai-coaches.dto';

const CoachFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CoachFetching
    : Messages.CoachFetchingDev;

const RouteFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.RouteFetching
    : Messages.RouteFetchingDev;

const SeatCoachFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.SeatCoachFetching
    : Messages.SeatCoachFetchingDev;

const CoachDetailFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CoachDetailFetching
    : Messages.CoachDetailFetchingDev;
@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @MessagePattern(CoachFetching)
  async getCoachDetail(@Payload() data: CoachFetchingMess) {
    return this.coachService.getCoachDetail(data);
  }

  @MessagePattern(SeatCoachFetching)
  async getSeatCoachDetail(@Payload() data: SeatCoachFetchingMess) {
    const returnData = await this.coachService.getSeatCoachDetail(data);
    if (!returnData) {
      return {
        success: false,
        data: null,
      };
    } else {
      return {
        success: true,
        data: returnData,
      };
    }
  }

  @MessagePattern(RouteFetching)
  async getCoaches(@Payload() data: RouteFetchingMess) {
    const returnData = await this.coachService.getCoaches(data);
    if (!returnData) {
      return {
        success: false,
        data: null,
      };
    } else {
      return {
        success: true,
        data: returnData,
      };
    }
  }

  @MessagePattern(CoachDetailFetching)
  async getTransitCab(@Payload() data: CoachDetailFetchingMess) {
    return this.coachService.getTripCoach(data);
  }

  // @Post('test')
  // async gettTransitCab(@Body('id') data: number) {
  //   return this.coachService.gettTripCoach(data);
  // }

  @Get('/')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SUPERVISING)
  async getAllCoaches() {
    const res = await this.coachService.getAllCoaches();
    return {
      success: true,
      data: res,
    };
  }

  @Get('/routes')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SCHEDULING)
  async getAllRoutes() {
    const data = await this.coachService.getAllRoutes();
    return {
      success: true,
      data: data,
    };
  }

  @Post('/available')
  @HttpCode(200)
  @UseGuards(RequireAuthStaffGuard, StaffRolesGuard)
  @Roles(StaffRoles.SCHEDULING)
  async getAvailableCoaches(
    @Body(ValidationPipe) getAvailableCoachesDto: GetAvailableCoachesDto,
  ) {
    const data = await this.coachService.getAvailableCoaches(
      getAvailableCoachesDto,
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
}
