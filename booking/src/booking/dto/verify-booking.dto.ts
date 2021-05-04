import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { VerifyBooking } from '../../constant/custom-interface';

export class VerifyBookingDto {
  @IsNotEmpty({ message: 'Mã đặt vé không được để trống' })
  @IsInt({ message: 'Mã đặt vé không chính xác' })
  readonly bookingId: number;

  @IsNotEmpty({ message: 'Xác nhận không được trống' })
  @IsIn([VerifyBooking.ACCEPT, VerifyBooking.DENY], {
    message: 'Xác nhận không hợp lệ',
  })
  readonly confirm: VerifyBooking;
}
