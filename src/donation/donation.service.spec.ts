import { Test, TestingModule } from '@nestjs/testing';
import { DonationService } from './donation.service';
import { getModelToken } from '@nestjs/mongoose';
import { XenditService } from '../xendit/xendit.service';
import { Model } from 'mongoose';
import { Donation } from './interfaces/donation.interface';
import { MakeDonationDto } from './dtos/make-donation.dto';
import { JwtStrategy } from 'src/auth/jwt.strategy';

describe('DonationService', () => {
  let service: DonationService;
  let model: Model<Donation>
  let xenditService: XenditService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationService,
        {
          provide: getModelToken('Donation'),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            aggregate: jest.fn()
          }
        },
        {
          provide: XenditService,
          useValue: {
            createQr: jest.fn(),
            transactionStatus: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<DonationService>(DonationService);
    model = module.get(getModelToken('Donation'))
    xenditService = module.get(XenditService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('allByUser', () => {
    it('return all user data', () => {
      const result = [
        { id: 'xxx' }
      ] as Donation[]
      jest.spyOn(model, 'find').mockResolvedValue(result)
      return expect(service.allByUser('xxx')).toBeTruthy()
    })
  })

  describe('create donation', () => {
    it('success', () => {
      const dto: MakeDonationDto = {
        name: 'Lubna',
        amount: 10000,
        message: 'coba'
      }
      const donation = {
        ...dto,
        save: jest.fn()
      } as unknown as Donation

      jest.spyOn(donation, 'save').mockResolvedValue(donation)
      jest.spyOn(model, 'create').mockResolvedValue(donation)
      jest.spyOn(xenditService, 'createQr').mockResolvedValue({ 'qr_string': 'XXXX' })

      return expect(service.create(dto, 'sucipto')).resolves
        .toEqual(expect.objectContaining(dto))
    })
  })

  it('detail / find by id', () => {
    const result = {
      id: 'real-id'
    } as Donation
    jest.spyOn(model, 'findById').mockResolvedValue(result)
    return expect(service.detail('real-id')).toBeTruthy()
  })

  it('validate:true', () => {
    jest.spyOn(xenditService, 'transactionStatus').mockResolvedValue({
      'external_id': 'xxx',
      'status': 'INACTIVE' // equal to completed
    })

    return expect(service.validate('xxx'))
      .resolves
      .toBeTruthy()
  })

  it('validate:wrong id', () => {
    jest.spyOn(xenditService, 'transactionStatus').mockResolvedValue({
      'external_id': 'xxx',
      'status': 'INACTIVE' // equal to completed
    })

    return expect(service.validate('yyy'))
      .resolves
      .toBeFalsy()
  })

  it('validate:still active', () => {
    jest.spyOn(xenditService, 'transactionStatus').mockResolvedValue({
      'external_id': 'xxx',
      'status': 'ACTIVE' // equal to completed
    })

    return expect(service.validate('xxx'))
      .resolves
      .toBeFalsy()
  })

  it('get balance: success', () => {
    const mockResult = [{
      _id: '5ecd5a390451fb8208239bb8',
      amount: 10000
    }]

    jest.spyOn(model, 'aggregate').mockResolvedValue(mockResult)
    return expect(service.balance('5ecd5a390451fb8208239bb8')).resolves.toEqual(mockResult[0])
  })

  it('get balance: null', () => {
    jest.spyOn(model, 'aggregate').mockResolvedValue([])
    return expect(service.balance('5ecd5a390451fb8208239bb8')).resolves.toEqual({
      _id: '5ecd5a390451fb8208239bb8',
      amount: 0
    })
  })


});
