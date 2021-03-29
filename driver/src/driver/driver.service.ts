import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverCreatedEvent, WorkingStatus } from '@quangdvnnnn/go-n-share';
import { Model } from 'mongoose';
import { Driver, DriverDocument } from './driver.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Location, LocationDocument } from './location.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(Driver.name)
    private readonly driverModel: Model<DriverDocument>,
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}
  async getDriverInfo(driverId: number) {
    const curDriver = await this.driverModel
      .findOne({
        id: driverId,
        workingStatus: WorkingStatus.WORKING,
      })
      .populate('location');
    if (!curDriver) {
      throw new BadRequestException('Đã xảy ra lỗi hệ thống');
    }
    return curDriver;
  }

  async createDriver(createDriverInput: DriverCreatedEvent) {
    const driverLocation = await this.locationModel.findOne({
      subname: createDriverInput.location,
    });
    const newDriver = new this.driverModel({
      ...createDriverInput,
      location: driverLocation,
    });
    return newDriver.save();
  }

  async createSchedule(createScheduleDto: CreateScheduleDto, driverId: number) {
    const curDriver = await this.driverModel.findOne({
      id: driverId,
      workingStatus: WorkingStatus.WORKING,
    });
    if (!curDriver) {
      throw new BadRequestException('Đã xảy ra lỗi hệ thống');
    }
    curDriver.schedule = [...createScheduleDto.schedule];
    if (!curDriver.isVerify) {
      curDriver.isVerify = true;
    }
    await curDriver.save();
    return curDriver;
  }
}
