import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DriverCreatedEvent,
  TripCreatedEvent,
  WorkingStatus,
} from '@quangdvnnnn/go-n-share';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { isDayBetween } from '../utils/isDayBetween';
import { Driver, DriverDocument, TripInterface } from './driver.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetAvailableDriversDto } from './dto/get-avai-drivers.dto';
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

  async getDriverDetail(driverId: number) {
    const curDriver = await this.driverModel.findOne({
      id: driverId,
      workingStatus: WorkingStatus.WORKING,
    });
    if (!curDriver) {
      return false;
    }
    return true;
  }

  async addTrip({ tripData }: TripCreatedEvent) {
    const firstTrip: TripInterface = {
      id: tripData[0].id,
      departureDate: tripData[0].departureDate,
      departureTime: tripData[0].departureTime,
      arriveDate: tripData[0].arriveDate,
      arrriveTime: tripData[0].arriveTime,
    };

    const secondTrip: TripInterface = {
      id: tripData[1].id,
      departureDate: tripData[1].departureDate,
      departureTime: tripData[1].departureTime,
      arriveDate: tripData[1].arriveDate,
      arrriveTime: tripData[1].arriveTime,
    };
    await this.driverModel.findOneAndUpdate(
      { id: tripData[0].driverId },
      {
        $push: {
          trips: {
            $each: [firstTrip, secondTrip],
          },
        },
      },
      {
        new: true,
      },
    );
  }

  async getAvailableDrivers(getAvailableDriversDto: GetAvailableDriversDto) {
    const {
      location,
      role,
      departureDate,
      shift,
      drivingDuration,
    } = getAvailableDriversDto;
    const curLocation = await this.locationModel.findOne({
      subname: location,
    });
    const drivers = await this.driverModel
      .find({
        role: role,
        location: curLocation._id,
        hasAssignedTrip: false,
        isVerify: true,
        workingStatus: WorkingStatus.WORKING,
      })
      .populate('location');

    const returnDrivers = drivers.filter((driver) => {
      if (driver.trips.length === 0) {
        return true;
      } else {
        const isValidOne = !driver.trips.some((trip) =>
          isDayBetween(departureDate, trip.departureDate, trip.arriveDate),
        );
        const isValidTwo = !driver.trips.some((trip) =>
          isDayBetween(
            dayjs(departureDate)
              .add(shift + drivingDuration, 'hours')
              .startOf('day'),
            trip.departureDate,
            trip.arriveDate,
          ),
        );
        return isValidOne && isValidTwo;
      }
    });
    return returnDrivers;
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
