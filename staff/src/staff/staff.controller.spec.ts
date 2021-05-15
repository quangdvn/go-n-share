import { Test, TestingModule } from '@nestjs/testing';
import { STAFF_SERVICE } from '../constants';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

describe('StaffController', () => {
  let controller: StaffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: STAFF_SERVICE,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
