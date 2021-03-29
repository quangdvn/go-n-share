import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DRIVER_SERVICE } from './constants';

const microserviceOptions: MicroserviceOptions = {
  transport: Transport.NATS,
  options: {
    url: process.env.NATS_URL,
    queue: DRIVER_SERVICE,
  },
};

async function bootstrap() {
  if (!process.env.APP_PORT) {
    throw new Error('APP_PORT missing');
  }

  if (!process.env.DB_TYPE) {
    throw new Error('DB_TYPE missing');
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
  app.setGlobalPrefix('driver');
  const logger = new Logger('Bootstrap');

  const microservice = app.connectMicroservice(microserviceOptions);
  microservice.listen(() => {
    logger.log('Driver Microservice is running ...');
    app.listen(process.env.APP_PORT, () => {
      logger.log(
        `Driver Service is listening on port ${process.env.APP_PORT} ...`,
      );
    });
  });
}
bootstrap();
