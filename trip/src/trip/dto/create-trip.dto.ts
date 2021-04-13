import { TripShift } from '@quangdvnnnn/go-n-share';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { ValidDate } from './valid-date.decorator';
import { ValidSchedule } from './valid-schedule.dto';

export class CreateTripDto {
  @IsNotEmpty({ message: 'Mã nhân viên không được trống' })
  @IsInt({ message: 'Mã nhân viên phải là số' })
  readonly driverId: number;

  @IsNotEmpty({ message: 'Mã xe khách không được trống' })
  @IsInt({ message: 'Mã xe khách phải là số' })
  readonly coachId: number;

  @IsNotEmpty({ message: 'Ca đi không được trống' })
  @IsIn([TripShift.MORNING, TripShift.AFTERNOON, TripShift.NIGHT], {
    message: 'Ca đi không hợp lệ',
  })
  readonly shift: TripShift;

  @IsNotEmpty({ message: 'Ngày khởi hành không được trống' })
  @ValidDate()
  @ValidSchedule()
  readonly departureDate: string;
}
