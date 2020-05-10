import { Test, TestingModule } from '@nestjs/testing';
import { XenditService } from './xendit.service';
import { ConfigModule } from '@nestjs/config';
import { HttpService, HttpModule } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AxiosResponse } from 'axios'

describe('XenditService', () => {
  let service: XenditService;
  let http: HttpService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [XenditService],
    }).compile();

    service = module.get<XenditService>(XenditService);
    http = module.get(HttpService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(http).toBeDefined()
  });

  it('create qr', () => {
    jest.spyOn(http, 'post').mockImplementation(() => {
      const x = {

      } as AxiosResponse
      x.data = { 'qr_string': 'xxxx' }
      return of(x)
    })

    return expect(service.createQr('xxx', 10000)).resolves
      .toEqual(expect.objectContaining({
        'qr_string': 'xxxx'
      }))
  })
});
