import { Location } from '@quangdvnnnn/go-n-share';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ValidDate } from './valid-date.decorator';

export class SearchTripDto {
  @IsNotEmpty({ message: 'Điểm đi không được trống' })
  @IsIn(
    [
      Location.HANOI_SUBNAME,
      Location.QUANGNINH_SUBNAME,
      Location.DANANG_SUBNAME,
      Location.HOCHIMINH_SUBNAME,
    ],
    {
      message: 'Điểm đi không hợp lệ',
    },
  )
  readonly departure: Location;

  @IsNotEmpty({ message: 'Điểm đến không được trống' })
  @IsIn(
    [
      Location.HANOI_SUBNAME,
      Location.QUANGNINH_SUBNAME,
      Location.DANANG_SUBNAME,
      Location.HOCHIMINH_SUBNAME,
    ],
    {
      message: 'Điểm đến không hợp lệ',
    },
  )
  readonly arrive: Location;

  @IsNotEmpty({ message: 'Ngày khởi hành không được trống' })
  @ValidDate()
  readonly departureDate: string;
}
