import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CurrentUserMiddleware } from '@quangdvnnnn/go-n-share';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

@Module({
  controllers: [CoachController],
  providers: [CoachService],
})
export class CoachModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
