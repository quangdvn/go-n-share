import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  DayOfWeek,
  DriverRoles,
  TripShift,
  TripStatus,
  WorkingStatus,
} from '@quangdvnnnn/go-n-share';
import mongoose, { Document } from 'mongoose';
import { Location } from './location.entity';
import { Location as LocationEnum } from '@quangdvnnnn/go-n-share';

export type DriverDocument = Driver & Document;

export type TripInterface = {
  id: number;
  departureDate: string;
  departureTime: number;
  arriveDate: string;
  arriveTime: number;
  departureLocation: LocationEnum;
  arriveLocation: LocationEnum;
  tripStatus?: TripStatus;
};

export type TransitInterface = {
  id: number;
  tripId: number;
  departureDate: string;
  departureShift: TripShift;
  transitStatus?: TripStatus;
};

const tripSchema = new mongoose.Schema({
  id: Number,
  departureDate: String,
  departureTime: Number,
  departureLocation: String,
  arriveDate: String,
  arriveTime: Number,
  arriveLocation: String,
  tripStatus: {
    type: TripStatus,
    default: TripStatus.UNCONFIRM,
  },
});

const transitSchema = new mongoose.Schema({
  id: Number,
  tripId: Number,
  departureDate: String,
  departureShift: Number,
  transitStatus: {
    type: TripStatus,
    default: TripStatus.UNCONFIRM,
  },
});

@Schema({ collection: 'drivers', timestamps: true })
export class Driver {
  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: String, required: true, minlength: 10, maxlength: 250 })
  fullname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
  })
  username: string;

  @Prop({ tpye: String, required: true, unique: true, length: 10 })
  phone: string;

  @Prop({ type: Number, required: true, min: 24, max: 50 })
  age: number;

  @Prop({ type: [Number], required: false, default: [] })
  schedule: DayOfWeek[];

  @Prop({ type: Boolean, default: false })
  isVerify: boolean;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(WorkingStatus),
    default: WorkingStatus.WORKING,
  })
  workingStatus: WorkingStatus;

  @Prop({ type: String, required: true })
  role: DriverRoles;

  @Prop({ type: Boolean, default: false })
  hasAssignedTrip: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Location' })
  location: Location;

  @Prop({ type: [tripSchema], required: false, default: [] })
  trips: TripInterface[];

  @Prop({ type: [transitSchema], required: false, default: [] })
  transits: TransitInterface[];
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
