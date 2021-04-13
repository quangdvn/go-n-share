import { Test, TestingModule } from '@nestjs/testing';
import { CabService } from './cab.service';

describe('CabService', () => {
  let service: CabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CabService],
    }).compile();

    service = module.get<CabService>(CabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
