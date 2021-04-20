import { PaymentMethod } from '@quangdvnnnn/go-n-share';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class TransitDetail {
  @IsNotEmpty({ message: 'Địa chỉ đón không được trống' })
  @IsString({ message: 'Địa chỉ đón là chuỗi' })
  @Length(10, 250, { message: 'Địa chỉ đón độ dài từ 10 đến 250' })
  readonly address: string;

  @IsNotEmpty({ message: 'Vĩ độ điểm đón không được trống' })
  @IsString({ message: 'Vĩ độ điểm đón là chuỗi' })
  readonly latitude: string;

  @IsNotEmpty({ message: 'Kinh độ điểm đón không được trống' })
  @IsString({ message: 'Kinh độ điểm đón là chuỗi' })
  readonly longitude: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú đón là chuỗi' })
  @Length(0, 500, { message: 'Ghi chú đón độ dài đến 500' })
  readonly notes: string;
}

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Mã chuyến đi không được để trống' })
  @IsInt({ message: 'Mã chuyến đi không chính xác' })
  readonly tripId: number;

  @IsNotEmpty({ message: 'Giá vé không được để trống' })
  @IsInt({ message: 'Giá vé không chính xác' })
  readonly price: number;

  @IsNotEmpty({ message: 'Tên người đặt không được trống' })
  @IsString({ message: 'Tên người đặt là chuỗi' })
  @Length(10, 250, { message: 'Tên người đặt độ dài từ 10 đến 250' })
  readonly bookingName: string;

  @IsNotEmpty({ message: 'Số điện thoại không được trống' })
  @IsString({ message: 'Số điện thoại là chuỗi' })
  @Length(10, 10, { message: 'Số điện thoại có 10 số' })
  @Matches(/((09|03|07|08|05)+([0-9]{8})\b)/, {
    message: 'Số điện thoại không đúng định dạng',
  })
  readonly bookingPhone: string;

  @IsNotEmpty({ message: 'Mail không được trống' })
  @IsEmail({}, { message: 'Mail không hợp lệ' })
  readonly bookingMail: string;

  @IsNotEmpty({ message: 'Lựa chọn chuyến đón không được trống' })
  @IsBoolean({ message: 'Lựa chọn chuyến đón không hợp lệ' })
  readonly hasTransit: boolean;

  @IsNotEmpty({ message: 'Thông tin chuyến đón không được trống' })
  @ValidateIf((object: CreateBookingDto) => object.hasTransit, {
    message: 'Thông tin chuyến đón thiếu',
  })
  @ValidateNested({ message: 'Thông tin chuyến đón không đúng định dạng' })
  @Type(() => TransitDetail)
  readonly transitDetail: TransitDetail;

  @IsOptional()
  @IsString({ message: 'Ghi chú chuyến đi là chuỗi' })
  @Length(0, 500, { message: 'Ghi chú chuyến đi độ dài đến 500' })
  readonly notes: string;

  @IsNotEmpty({ message: 'Hình thức thanh toán không được trống' })
  @IsIn([PaymentMethod.CASH, PaymentMethod.ONLINE], {
    message: 'Hình thức thanh toán không hợp lệ',
  })
  readonly paymentMethod: PaymentMethod;
}
