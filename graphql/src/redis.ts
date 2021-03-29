import Redis from 'redis';

export const RedisClient = Redis.createClient({
  host: 'redis-18451.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port: 18451,
  password: '123456',
});
