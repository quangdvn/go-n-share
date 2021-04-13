import Redis from 'redis';

export const RedisClient = Redis.createClient({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
