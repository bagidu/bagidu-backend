import { Test, TestingModule } from '@nestjs/testing';
import { XenditService } from './xendit.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService, HttpModule } from '@nestjs/common';

describe('XenditService', () => {
  let service: XenditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[ConfigModule,HttpModule],
      providers: [XenditService],
    }).compile();

    service = module.get<XenditService>(XenditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
