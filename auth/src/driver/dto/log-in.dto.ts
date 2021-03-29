import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LogInDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không để trống' })
  @IsString({ message: 'Tên đăng nhập là chuỗi' })
  @Length(5, 20, { message: 'Tên đăng nhập độ dài từ 5 đến 20' })
  readonly username: string;

  @IsNotEmpty({ message: 'Mật khẩu không để trống' })
  @IsString({ message: 'Mật khẩu là chuỗi' })
  @Length(5, 20, { message: 'Mật khẩu độ dài từ 5 đến 20' })
  readonly password: string;
}
