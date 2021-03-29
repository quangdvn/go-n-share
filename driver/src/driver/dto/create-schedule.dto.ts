import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ValidSchedule } from './valid-schedule.decorator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: 'Lịch làm không có' })
  @IsArray({ message: 'Lịch làm là một mảng' })
  @ArrayNotEmpty({ message: 'Lịch làm không được trống' })
  @IsNumber({}, { each: true, message: 'Lịch làm không đúng quy tắc' })
  @IsIn([1, 2, 3, 4, 5, 6, 7], {
    each: true,
    message: 'Lịch làm không tồn tại',
  })
  @ValidSchedule()
  readonly schedule: number[];
}
