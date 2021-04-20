export const TRIP_SERVICE = 'TRIP_SERVICE';

export const DB_TYPE = 'mysql';

export enum TransitDetailEnum {
  READY = 'ready',
  WAITING = 'waiting',
  PICKED = 'picked',
  CANCELLED = 'cancelled',
}

export const __prod__ = process.env.NODE_ENV === 'production';
