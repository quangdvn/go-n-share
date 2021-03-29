import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffModule } from './staff/staff.module';
import typeOrmConfig from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
