import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import * as connectionOptions from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(connectionOptions), BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
