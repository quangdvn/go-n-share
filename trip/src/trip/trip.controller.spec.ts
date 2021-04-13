import { Test, TestingModule } from '@nestjs/testing';
import { TRIP_SERVICE } from '../constants';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';

describe('TripController', () => {
  let controller: TripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        TripService,
        {
          provide: TRIP_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TripController>(TripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
