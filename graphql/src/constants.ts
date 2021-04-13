import { DriverRoles, Location, TripShift } from '@quangdvnnnn/go-n-share';
import { registerEnumType } from 'type-graphql';

export const __prod__ = process.env.NODE_ENV === 'production';

export enum LogInType {
  STAFF = 'staff',
  DRIVER = 'driver',
}

registerEnumType(LogInType, {
  name: 'LogInType',
  description: 'Log In Type',
});

registerEnumType(Location, {
  name: 'LocationType',
  description: 'Location Type',
});

registerEnumType(DriverRoles, {
  name: 'DriverRolesType',
  description: 'Driver Roles Type',
});

registerEnumType(TripShift, {
  name: 'TripShiftType',
  description: 'Trip Shift Type',
});
