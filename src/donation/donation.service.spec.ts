import { Test, TestingModule } from '@nestjs/testing';
import { DonationService } from './donation.service';
import { getModelToken } from '@nestjs/mongoose';

describe('DonationService', () => {
  let service: DonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationService,
        {
          provide: getModelToken('Donation'),
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<DonationService>(DonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
