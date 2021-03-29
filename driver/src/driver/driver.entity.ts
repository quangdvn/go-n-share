import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DayOfWeek, DriverRoles, WorkingStatus } from '@quangdvnnnn/go-n-share';
import { Document, Types } from 'mongoose';
import { Location } from './location.entity';

export type DriverDocument = Driver & Document;

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

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  location: Location;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
