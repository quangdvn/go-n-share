import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DriverCreatedEvent,
  DriverRoles,
  TransitCreatedEvent,
  TransitDriverFetchingMess,
  TripCreatedEvent,
  WorkingStatus,
} from '@quangdvnnnn/go-n-share';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { isDayBetween } from '../utils/isDayBetween';
import {
  Driver,
  DriverDocument,
  TransitInterface,
  TripInterface,
} from './driver.entity';
import { ConfirmTransitDto } from './dto/confirm-transit.dto';
import { ConfirmTripDto } from './dto/confirm-trip.dto';
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

  async getTransitDrivers(data: TransitDriverFetchingMess) {
    const curLocation = await this.locationModel.findOne({
      subname: data.location,
    });
    const drivers = await this.driverModel.find({
      role: DriverRoles.TRANSIT_TRIP,
      location: curLocation._id,
      hasAssignedTrip: false,
      isVerify: true,
      workingStatus: WorkingStatus.WORKING,
    });

    const res = drivers.filter((driver) => {
      const hasTrip = driver.transits.findIndex(
        (transit) =>
          transit.departureDate === data.date &&
          transit.departureShift === data.shift,
      );
      if (hasTrip >= 0) {
        return false;
      }
      return true;
    });
    return res.map((res) => res.id as number);
  }

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
      role: DriverRoles.FIXED_TRIP,
      hasAssignedTrip: false,
      isVerify: true,
    });
    if (!curDriver) {
      return false;
    }
    return true;
  }

  async confirmTripStatus(confirmTripDto: ConfirmTripDto, driverId: number) {
    const curDriver = await this.driverModel
      .findOne({
        id: driverId,
        workingStatus: WorkingStatus.WORKING,
        role: DriverRoles.FIXED_TRIP,
      })
      .populate('location');
    if (!curDriver) {
      throw new BadRequestException('Đã xảy ra lỗi hệ thống');
    }
    const curTrip = curDriver.trips.find(
      (trip) => trip.id === confirmTripDto.tripId,
    );
    if (!curTrip) {
      throw new BadRequestException('Chuyến đi không tồn tại');
    }
    curTrip.tripStatus = confirmTripDto.status;
    await curDriver.save();

    return { driver: curDriver, trip: curTrip };
  }

  async confirmTransitStatus(
    confirmTransitDto: ConfirmTransitDto,
    driverId: number,
  ) {
    const curDriver = await this.driverModel
      .findOne({
        id: driverId,
        workingStatus: WorkingStatus.WORKING,
        role: DriverRoles.TRANSIT_TRIP,
      })
      .populate('location');
    if (!curDriver) {
      throw new BadRequestException('Đã xảy ra lỗi hệ thống');
    }
    const curTransit = curDriver.transits.find(
      (transit) => transit.id === confirmTransitDto.transitId,
    );
    if (!curTransit) {
      throw new BadRequestException('Chuyến đi không tồn tại');
    }
    curTransit.transitStatus = confirmTransitDto.status;
    await curDriver.save();

    return { driver: curDriver, transit: curTransit };
  }

  async addTrip({ tripData }: TripCreatedEvent) {
    const firstTrip: TripInterface = {
      id: tripData[0].id,
      departureDate: tripData[0].departureDate,
      departureTime: tripData[0].departureTime,
      departureLocation: tripData[0].departureLocation,
      arriveDate: tripData[0].arriveDate,
      arrriveTime: tripData[0].arriveTime,
      arriveLocation: tripData[0].arriveLocation,
    };

    const secondTrip: TripInterface = {
      id: tripData[1].id,
      departureDate: tripData[1].departureDate,
      departureTime: tripData[1].departureTime,
      departureLocation: tripData[1].departureLocation,
      arriveDate: tripData[1].arriveDate,
      arrriveTime: tripData[1].arriveTime,
      arriveLocation: tripData[1].arriveLocation,
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

  async addTransit({ transitData }: TransitCreatedEvent) {
    const firstTransit: TransitInterface = {
      id: transitData[0].id,
      tripId: transitData[0].tripId,
      departureDate: transitData[0].departureDate,
      departureShift: transitData[0].departureShift,
    };

    const secondTransit: TransitInterface = {
      id: transitData[1].id,
      tripId: transitData[1].tripId,
      departureDate: transitData[1].departureDate,
      departureShift: transitData[1].departureShift,
    };
    await this.driverModel.findOneAndUpdate(
      { id: transitData[0].driverId },
      {
        $push: {
          transits: {
            $each: [firstTransit],
          },
        },
      },
      {
        new: true,
      },
    );
    await this.driverModel.findOneAndUpdate(
      { id: transitData[1].driverId },
      {
        $push: {
          transits: {
            $each: [secondTransit],
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
        const isValidOne = !driver.trips.some((trip) => {
          return isDayBetween(
            departureDate,
            trip.departureDate,
            trip.arriveDate,
          );
        });
        const isValidTwo = !driver.trips.some((trip) =>
          isDayBetween(
            dayjs(departureDate).add(shift + drivingDuration, 'hours'),
            dayjs(trip.departureDate).add(trip.departureTime, 'hours'),
            dayjs(trip.arriveDate).add(trip.arrriveTime, 'hours'),
          ),
        );
        console.log('1', driver.id);
        console.log('2', isValidOne);
        console.log('3', isValidTwo);
        return isValidOne || isValidTwo;
      }
    });
    return returnDrivers.map((driver) => driver.id);
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
