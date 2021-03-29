import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Location as LocationProp } from '@quangdvnnnn/go-n-share';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ collection: 'locations' })
export class Location {
  @Prop({ type: String, required: true, unique: true })
  name: LocationProp;

  @Prop({ type: String, required: true, unique: true })
  subname: LocationProp;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
