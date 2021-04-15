import { TripStatus } from '@quangdvnnnn/go-n-share';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

export class ConfirmTripDto {
  @IsNotEmpty({ message: 'Mã chuyến không được trống' })
  @IsInt({ message: 'Mã chuyến là số nguyên' })
  readonly tripId: number;

  @IsNotEmpty({ message: 'Trạng thái không được trống' })
  @IsIn([TripStatus.READY, TripStatus.GOING, TripStatus.FINISHED], {
    message: 'Trạng thái không hợp lệ',
  })
  readonly status: TripStatus;
}
