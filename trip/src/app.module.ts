import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './trip/trip.module';
import { TransitModule } from './transit/transit.module';
import * as connectionOptions from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    TripModule,
    TransitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
