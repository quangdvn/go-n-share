import { TripShift } from '@quangdvnnnn/go-n-share';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';
import { ValidDate } from './valid-date.decorator';

export class GetAvailableCoachesDto {
  @IsNotEmpty({ message: 'Mã chặng đi không được trống' })
  @IsInt({ message: 'Mã chặng đi phải là số' })
  readonly routeId: number;

  @IsNotEmpty({ message: 'Ca đi không được trống' })
  @IsInt({ message: 'Mã chặng đi phải là số' })
  @IsIn([TripShift.MORNING, TripShift.AFTERNOON, TripShift.NIGHT], {
    message: 'Ca đi không hợp lệ',
  })
  readonly shift: TripShift;

  @IsNotEmpty({ message: 'Ngày khởi hành không được trống' })
  @ValidDate()
  readonly departureDate: string;
}
