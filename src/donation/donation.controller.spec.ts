import { Test, TestingModule } from '@nestjs/testing';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Donation } from './interfaces/donation.interface';
import { NotFoundException } from '@nestjs/common';

describe('Donation Controller', () => {
  let controller: DonationController;
  let userService: UserService
  let donationService: DonationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationController],
      providers: [
        {
          provide: DonationService,
          useValue: {
            create: jest.fn(),
            detail: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            findBy: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<DonationController>(DonationController);
    userService = module.get(UserService)
    donationService = module.get(DonationService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('make donation', () => {
    it('return response with qr', () => {
      const dto = {
        name: 'Sucipto',
        amount: 1500,
        message: 'Buat sahur',
      }

      const mockDoc = {
        ...dto,
        id: 'xxx',
        qr: 'xxxxxx',
        createdAt: new Date(),
        to: 'lubna',
        status: 'PENDING',
        _id: 'xxx'
      } as unknown as Donation

      const user = {
        id: 'yyyy',
        username: 'lubna'
      } as User

      jest.spyOn(userService, 'findBy').mockResolvedValue(user)
      jest.spyOn(donationService, 'create').mockResolvedValue(mockDoc)

      return expect(controller.create(dto, 'lubna')).resolves
        .toEqual(expect.objectContaining(dto))

    })

    it('return not found if wrong username', () => {
      const dto = {
        name: 'Sucipto',
        amount: 1500,
        message: 'Buat sahur',
      }

      jest.spyOn(userService, 'findBy').mockResolvedValue(null)

      return expect(controller.create(dto, 'unknown')).rejects.toThrow(NotFoundException)
    })
  })

  describe('donation detail', () => {
    it('get from public', () => {
      const donation = {
        id: 'someid',
        amount: 10000,
        status: 'PENDING'
      } as unknown as Donation
      jest.spyOn(donationService, 'detail').mockResolvedValue(donation)
      return expect(controller.detail('someid')).resolves.toEqual(
        expect.objectContaining({
          amount: 10000,
          status: 'PENDING'
        })
      )
    })

    it('not found', () => {
      jest.spyOn(donationService, 'detail').mockResolvedValue(null)
      return expect(controller.detail('invalid-id')).rejects.toThrow(NotFoundException)
    })
  })
});
