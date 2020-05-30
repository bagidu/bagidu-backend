import { Injectable, HttpService } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { map } from 'rxjs/operators'

@Injectable()
export class AppService {
  constructor(private http: HttpService) { }

  getHello(): string {
    return 'Diam itu emas 🤪'
  }

  @Cron('0 */10 * * * *')
  ping(): void {
    this.http.get('https://api.bagidu.id/?ping_schedule').pipe(
      map(res => res.status)
    ).subscribe(status => console.log(`ping status: ${status}`))
  }
}
