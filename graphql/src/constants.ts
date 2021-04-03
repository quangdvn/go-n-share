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
