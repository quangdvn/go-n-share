import Redis from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

export const RedisClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: +(process.env.REDIS_PORT as string),
  password: process.env.REDIS_PASSWORD,
});
