import { DriverRoles, Location, StaffRoles } from '@quangdvnnnn/go-n-share';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty({ message: 'Tên không được trống' })
  @IsString({ message: 'Tên là chuỗi' })
  @Length(10, 250, { message: 'Tên độ dài từ 10 đến 250' })
  readonly fullname: string;

  @IsNotEmpty({ message: 'Tài khoản không được trống' })
  @IsString({ message: 'Tài khoản là chuỗi' })
  @Length(5, 20, { message: 'Tài khoản độ dài từ 5 đến 20' })
  readonly username: string;

  @IsNotEmpty({ message: 'Mật khẩu không được trống' })
  @IsString({ message: 'Mật khẩu là chuỗi' })
  @Length(5, 20, { message: 'Mật khẩu độ dài từ 5 đến 20' })
  readonly password: string;

  @IsNotEmpty({ message: 'Tuổi không được trống' })
  @Min(24, { message: 'Tuổi thấp nhất là 24' })
  @Max(50, { message: 'Tuổi thấp nhất là 50' })
  readonly age: number;

  @IsNotEmpty({ message: 'Số điện thoại không được trống' })
  @IsString({ message: 'Số điện thoại là chuỗi' })
  @Length(10, 10, { message: 'Số điện thoại có 10 số' })
  @Matches(/((09|03|07|08|05)+([0-9]{8})\b)/, {
    message: 'Số điện thoại không đúng định dạng',
  })
  readonly phone: string;

  @IsNotEmpty({ message: 'Vị trí tài xế không được trống' })
  @IsIn([DriverRoles.FIXED_TRIP, DriverRoles.TRANSIT_TRIP], {
    message: 'Vị trí tài xế không hợp lệ',
  })
  readonly role: DriverRoles;

  @IsNotEmpty({ message: 'Địa điểm hiện tại không được trống' })
  @IsIn(
    [
      Location.DANANG_SUBNAME,
      Location.HANOI_SUBNAME,
      Location.HOCHIMINH_SUBNAME,
      Location.QUANGNINH_SUBNAME,
    ],
    { message: 'Địa điểm hiện tại không hợp lệ' },
  )
  readonly location: Location;
}
