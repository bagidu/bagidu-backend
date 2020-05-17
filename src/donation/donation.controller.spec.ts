import { Test, TestingModule } from '@nestjs/testing';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { Donation } from './interfaces/donation.interface';
import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { XenditCallbackDto } from './dtos/xendit-callback.dto';

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

  describe('dto', () => {
    it('xendit callback dto:parsed', () => {
      const dto = plainToClass(XenditCallbackDto, {
        "event": "qr.payment",
        "id": "qrpy_8182837te-87st-49ing-8696-1239bd4d759c",
        "amount": 1500,
        "created": "2020-01-08T18:18:18.857Z",
        "qr_code": {
          "id": "qr_8182837te-87st-49ing-8696-1239bd4d759c",
          "external_id": "testing_id_123",
          "qr_string": "0002010102##########CO.XENDIT.WWW011893600#######14220002152#####414220010303TTT####015CO.XENDIT.WWW02180000000000000000000TTT52045######ID5911XenditQRIS6007Jakarta6105121606##########3k1mOnF73h11111111#3k1mOnF73h6v53033605401163040BDB",
          "type": "DYNAMIC"
        },
        "status": "COMPLETED"
      })

      return expect(dto.qr_code.id).toEqual("qr_8182837te-87st-49ing-8696-1239bd4d759c")
    })
  })
});
