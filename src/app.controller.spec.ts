import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios'

describe('AppController', () => {
  let appController: AppController;
  let service: AppService
  let http: HttpService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    service = app.get(AppService)
    http = app.get(HttpService)
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });

    it('cron: ping called', () => {
      jest.spyOn(http, 'get').mockImplementation(() => {

        const resp = {
        } as AxiosResponse
        resp.data = {
          'external_id': 'xxx'
        }
        return of(resp)
      })

      service.ping()

      expect(http.get).toBeCalledTimes(1)
    })
  });
});
