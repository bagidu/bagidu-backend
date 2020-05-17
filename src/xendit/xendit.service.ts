import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators'

@Injectable()
export class XenditService {
    private apiKey: string;
    private apiUrl = 'https://api.xendit.co';
    private appUrl: string

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) {
        this.apiKey = this.configService.get<string>('XENDIT_KEY')
        this.appUrl = this.configService.get<string>('APP_URL')
    }

    async createQr(id: string, amount: number): Promise<any> {
        return this.httpService.post(this.apiUrl + '/qr_codes',
            {
                // eslint-disable-next-line @typescript-eslint/camelcase
                external_id: id,
                type: 'DYNAMIC',
                amount: amount,
                // eslint-disable-next-line @typescript-eslint/camelcase
                callback_url: `${this.appUrl}/donation/${id}/callback`
            },
            {
                auth: {
                    username: this.apiKey,
                    password: ''
                }
            }
        ).pipe(
            map(response => response.data)
        ).toPromise()

    }

    async transactionStatus(id: string) {
        return this.httpService.get(`${this.apiUrl}/qr_codes/${id}`,
            {
                auth: {
                    username: this.apiKey,
                    password: ''
                }
            }
        )
            .pipe(
                map(response => response.data)
            )
            .toPromise()
    }
}
