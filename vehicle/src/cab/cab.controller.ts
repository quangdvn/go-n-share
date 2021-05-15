import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CabFetchingMess,
  Messages,
  TransitCabFetchingMess,
} from '@quangdvnnnn/go-n-share';
import { CabService } from './cab.service';

const TransitCabFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitCabFetching
    : Messages.TransitCabFetchingDev;

const CabFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.CabFetching
    : Messages.CabFetchingDev;
@Controller('cab')
export class CabController {
  constructor(private readonly cabService: CabService) {}

  @MessagePattern(TransitCabFetching)
  async getTransitCabs(@Payload() data: TransitCabFetchingMess) {
    const res = await this.cabService.getTransitCabs(data);
    return res;
  }

  @MessagePattern(CabFetching)
  async getTransitCab(@Payload() data: CabFetchingMess) {
    const returnData = await this.cabService.getTransitCab(data);
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

  // @Post('test')
  // async gettTransitCab(
  //   @Body('cabId') cabId: number,
  //   @Body('tripId') tripId: number,
  // ) {
  //   return this.cabService.gettTransitCab(cabId, tripId);
  // }
}
