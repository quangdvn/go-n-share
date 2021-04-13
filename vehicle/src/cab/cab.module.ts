import { Module } from '@nestjs/common';
import { CabController } from './cab.controller';
import { CabService } from './cab.service';

@Module({
  controllers: [CabController],
  providers: [CabService],
})
export class CabModule {}
