import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffModule } from './staff/staff.module';
import { DriverModule } from './driver/driver.module';
import typeOrmConfig from './typeorm.config';

@Module({
  imports: [StaffModule, TypeOrmModule.forRoot(typeOrmConfig), DriverModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
