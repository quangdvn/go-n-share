import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { StaffSackedEvent, WorkingStatus } from '@quangdvnnnn/go-n-share';
import { getConnection } from 'typeorm';
import {
  CreateStaffInput,
  StaffLoginPayload,
} from '../constants/custom-interface';

import { LogInDto } from './dto/log-in.dto';
import { Staff } from './staff.entity';

@Injectable()
export class StaffService {
  constructor() {}

  async createStaff(createStaffInput: CreateStaffInput) {
    const { username, password, role } = createStaffInput;
    const newStaff = Staff.create({
      username,
      password,
      role,
    });
    try {
      await newStaff.save();
      return newStaff;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Tên đăng nhập đã tồn tại');
      } else {
        throw new BadRequestException('Có lỗi trong quá trình tạo mới');
      }
    }
  }

  async logIn(logInDto: LogInDto): Promise<StaffLoginPayload> {
    const { username, password } = logInDto;
    const curStaff = await Staff.findOne({
      where: { username, workingStatus: WorkingStatus.WORKING },
    });
    if (curStaff && (await curStaff.validatePassword(password))) {
      const token = curStaff.generateAuthToken();
      return {
        staff: curStaff,
        token: token,
      };
    } else {
      throw new BadRequestException('Thông tin đăng nhập bị sai');
    }
  }

  async sackStaff(data: StaffSackedEvent) {
    const returnData = await getConnection()
      .createQueryBuilder()
      .update(Staff)
      .set({ workingStatus: WorkingStatus.RESIGN })
      .where('id = :id', { id: data.staffId })
      .execute();

    return returnData;
  }
}
