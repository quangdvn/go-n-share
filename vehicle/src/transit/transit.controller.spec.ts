import { Test, TestingModule } from '@nestjs/testing';
import { TransitController } from './transit.controller';
import { TransitService } from './transit.service';

describe('TransitController', () => {
  let controller: TransitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransitController],
      providers: [TransitService],
    }).compile();

    controller = module.get<TransitController>(TransitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
