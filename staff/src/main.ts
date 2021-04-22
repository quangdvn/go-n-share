import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { AppModule } from './app.module';
import { STAFF_SERVICE, __prod__ } from './constants';
import { RedisClient } from './redis';

const microserviceOptions: MicroserviceOptions = {
  transport: Transport.NATS,
  options: {
    url: process.env.NATS_URL,
    queue: STAFF_SERVICE,
  },
};

async function bootstrap() {
  if (!process.env.APP_PORT) {
    throw new Error('APP_PORT missing');
  }

  if (!process.env.SESSION_NAME) {
    throw new Error('SESSION_NAME missing');
  }

  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET missing');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET missing');
  }

  if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST missing');
  }

  if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT missing');
  }

  if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD missing');
  }

  if (!process.env.DB_HOST) {
    throw new Error('DB_HOST missing');
  }

  if (!process.env.DB_PORT) {
    throw new Error('DB_PORT missing');
  }

  if (!process.env.DB_USERNAME) {
    throw new Error('DB_USERNAME missing');
  }

  if (!process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD missing');
  }

  if (!process.env.DB_NAME) {
    throw new Error('DB_NAME missing');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL missing');
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const logger = new Logger('Bootstrap');

  const RedisStore = connectRedis(session);

  RedisClient.on('error', function (err) {
    logger.error('Could not establish a connection with redis. ' + err);
  });
  RedisClient.on('connect', function () {
    logger.log('Connected to redis successfully ...');
  });

  app.use(
    session({
      store: new RedisStore({
        client: RedisClient,
      }),
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        signed: false,
        httpOnly: true,
        domain: 'quangdvn.me',
        secure: __prod__, //* Over HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //* 10 years,
        sameSite: 'none', //* csrf,
      },
    }),
  );

  const microservice = app.connectMicroservice(microserviceOptions);
  microservice.listen(() => {
    logger.log('Staff Microservice is running ...');
    app.listen(process.env.APP_PORT, () => {
      logger.log(
        `Staff Service is listening on port ${process.env.APP_PORT}  ...`,
      );
      if (__prod__) {
        logger.log('Driver Service is running on production ...');
      }
    });
  });
}
bootstrap();
