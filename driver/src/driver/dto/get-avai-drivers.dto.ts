import { DriverRoles, Location, TripShift } from '@quangdvnnnn/go-n-share';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { ValidDate } from './valid-date.decorator';

export class GetAvailableDriversDto {
  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  @IsIn(
    [
      Location.DANANG_SUBNAME,
      Location.HANOI_SUBNAME,
      Location.HOCHIMINH_SUBNAME,
      Location.QUANGNINH_SUBNAME,
    ],
    {
      message: 'Địa điểm không chính xác',
    },
  )
  readonly location: Location;

  @IsNotEmpty({ message: 'Kiểu tài xế không được để trống' })
  @IsIn([DriverRoles.FIXED_TRIP, DriverRoles.TRANSIT_TRIP], {
    message: 'Kiểu tài xế không chính xác',
  })
  readonly role: DriverRoles;

  @IsNotEmpty({ message: 'Ngày khởi hành không được trống' })
  @ValidDate()
  readonly departureDate: string;

  @IsNotEmpty({ message: 'Ca đi không được trống' })
  @IsIn([TripShift.MORNING, TripShift.AFTERNOON, TripShift.NIGHT], {
    message: 'Ca đi không hợp lệ',
  })
  readonly shift: TripShift;

  @IsNotEmpty({ message: 'Thời gian đi không được trống' })
  @IsInt({ message: 'Thời gian đi không hợp lệ' })
  readonly drivingDuration: number;
}
