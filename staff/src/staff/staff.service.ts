import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  StaffCreatedEvent,
  StaffRoles,
  WorkingStatus,
} from '@quangdvnnnn/go-n-share';
import { Not } from 'typeorm';
import { Staff } from './staff.entity';

@Injectable()
export class StaffService {
  constructor() {}

  async createStaff(createStaffInput: StaffCreatedEvent) {
    const newStaff = Staff.create(createStaffInput);
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

  async getAllSfaff() {
    const allStaff = await Staff.find();
    if (!allStaff) {
      throw new BadRequestException('Có lỗi trong hệ thống');
    }
    return allStaff;
  }

  async getStaffInfo(staffId: number) {
    const curStaff = await Staff.findOne({
      where: { id: staffId, workingStatus: WorkingStatus.WORKING },
    });
    if (!curStaff) {
      throw new BadRequestException('Có lỗi trong hệ thống');
    }
    return curStaff;
  }

  async sackStaff(staffId: number) {
    const curStaff = await Staff.findOne({
      where: {
        id: staffId,
        workingStatus: WorkingStatus.WORKING,
        role: Not(StaffRoles.SUPERVISING),
      },
    });

    if (!curStaff) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }
    curStaff.workingStatus = WorkingStatus.RESIGN;

    const res = await curStaff.save();
    return res;
  }
}
