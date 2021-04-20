import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Messages, TransitCabFetchingMess } from '@quangdvnnnn/go-n-share';
import { CabService } from './cab.service';

const TransitCabFetching =
  process.env.NODE_ENV === 'production'
    ? Messages.TransitCabFetching
    : Messages.TransitCabFetchingDev;
@Controller('cab')
export class CabController {
  constructor(private readonly cabService: CabService) {}

  @MessagePattern(TransitCabFetching)
  async getTransitCabs(@Payload() data: TransitCabFetchingMess) {
    const res = await this.cabService.getTransitCabs(data);
    return res;
  }
}
