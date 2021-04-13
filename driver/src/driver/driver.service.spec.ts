import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DriverRoles, WorkingStatus, Location } from '@quangdvnnnn/go-n-share';
import { Driver } from './driver.entity';
import { DriverService } from './driver.service';
import { Location as LocBuilder } from './location.entity';

const mockLocation = (): LocBuilder => ({
  name: Location.HANOI,
  subname: Location.HANOI_SUBNAME,
});

const mockDriver = (): Driver => ({
  id: 1,
  age: 20,
  fullname: 'ABCBABCABC',
  hasAssignedTrip: true,
  isVerify: true,
  phone: '1111111111',
  location: mockLocation(),
  role: DriverRoles.FIXED_TRIP,
  schedule: [1, 2, 3],
  username: 'abcabc',
  workingStatus: WorkingStatus.WORKING,
  trips: [],
});

describe('DriverService', () => {
  let service: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getModelToken('Driver'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockDriver()),
            constructor: jest.fn().mockResolvedValue(mockDriver()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Location'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockLocation()),
            constructor: jest.fn().mockResolvedValue(mockLocation()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
