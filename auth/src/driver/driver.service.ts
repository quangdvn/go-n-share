import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { WorkingStatus } from '@quangdvnnnn/go-n-share';
import {
  CreateDriverInput,
  DriverLoginPayload,
} from '../constants/custom-interface';
import { Driver } from './driver.entity';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class DriverService {
  constructor() {}

  async createDriver(createDriverInput: CreateDriverInput) {
    const newDriver = Driver.create(createDriverInput);
    try {
      await newDriver.save();
      return newDriver;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Thông tin đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi trong quá trình tạo mới');
      }
    }
  }

  async logIn(logInDto: LogInDto): Promise<DriverLoginPayload> {
    const { username, password } = logInDto;
    const curDriver = await Driver.findOne({
      where: { username, workingStatus: WorkingStatus.WORKING },
    });
    if (curDriver && (await curDriver.validatePassword(password))) {
      const token = curDriver.generateAuthToken();
      return {
        driver: curDriver,
        token: token,
      };
    } else {
      throw new BadRequestException('Thông tin đăng nhập bị sai');
    }
  }
}
