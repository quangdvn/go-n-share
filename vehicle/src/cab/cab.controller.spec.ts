import { Test, TestingModule } from '@nestjs/testing';
import { CabController } from './cab.controller';

describe('CabController', () => {
  let controller: CabController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabController],
    }).compile();

    controller = module.get<CabController>(CabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
