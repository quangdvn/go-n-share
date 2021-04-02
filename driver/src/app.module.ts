import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { __prod__ } from './constants';
import { DriverModule } from './driver/driver.module';

const mongoUri = __prod__
  ? `${process.env.DB_TYPE}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/`
  : `${process.env.DB_TYPE}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/`;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri, {
      useNewUrlParser: true,
      dbName: `${process.env.DB_NAME}`,
      autoCreate: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    DriverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
