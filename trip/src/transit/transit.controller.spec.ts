import { Test, TestingModule } from '@nestjs/testing';
import { TRIP_SERVICE } from '../constants';
import { TransitController } from './transit.controller';
import { TransitService } from './transit.service';

describe('TransitController', () => {
  let controller: TransitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransitController],
      providers: [
        TransitService,
        {
          provide: TRIP_SERVICE,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransitController>(TransitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
