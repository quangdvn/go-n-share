import { StaffRoles } from '@quangdvnnnn/go-n-share';
import { IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateStaffDto {
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
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Mật khẩu chưa đủ mạnh',
  // })
  readonly password: string;

  @IsNotEmpty({ message: 'Số điện thoại không được trống' })
  @IsString({ message: 'Số điện thoại là chuỗi' })
  @Length(10, 10, { message: 'Số điện thoại có 10 số' })
  @Matches(/((09|03|07|08|05)+([0-9]{8})\b)/, {
    message: 'Số điện thoại không đúng định dạng',
  })
  readonly phone: string;

  @IsNotEmpty({ message: 'Vị trí nhân viên không được trống' })
  @IsIn([StaffRoles.SCHEDULING, StaffRoles.TRACKING], {
    message: 'Vị trí nhân viên không hợp lệ',
  })
  readonly role: StaffRoles;
}
