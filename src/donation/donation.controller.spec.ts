import { Test, TestingModule } from '@nestjs/testing';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { UserService } from '../user/user.service';

describe('Donation Controller', () => {
  let controller: DonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationController],
      providers: [
        {
          provide: DonationService,
          useValue: {}
        },
        {
          provide: UserService,
          useValue: {}
        }
      ]
    }).compile();

    controller = module.get<DonationController>(DonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
