import { Test, TestingModule } from '@nestjs/testing';
import { CabController } from './cab.controller';
import { CabService } from './cab.service';

describe('CabController', () => {
  let controller: CabController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabController],
      providers: [CabService],
    }).compile();

    controller = module.get<CabController>(CabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
