import { Injectable, HttpService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(private http: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  @Cron('* */10 * * * *')
  ping(): void {
    console.log('schedule ping')
    this.http.get('https://api.bagidu.id')
  }
}
