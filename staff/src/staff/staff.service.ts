import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { StaffCreatedEvent, WorkingStatus } from '@quangdvnnnn/go-n-share';
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

  async getStaffInfo(staffId: number) {
    const curStaff = await Staff.findOne({
      where: { id: staffId, workingStatus: WorkingStatus.WORKING },
    });
    if (!curStaff) {
      throw new BadRequestException('Có lỗi trong hệ thống');
    }
    return curStaff;
  }
}
