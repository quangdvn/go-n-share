import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CabModule } from './cab/cab.module';
import { CoachModule } from './coach/coach.module';
import { TripModule } from './trip/trip.module';
import * as connectionOptions from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    CabModule,
    CoachModule,
    TripModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
