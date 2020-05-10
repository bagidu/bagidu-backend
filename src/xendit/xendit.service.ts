import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Donation } from '../donation/entities/donation.entity';
import { map } from 'rxjs/operators'

@Injectable()
export class XenditService {
    private apiKey: string;
    private apiUrl = 'https://api.xendit.co';

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) {
        this.apiKey = this.configService.get<string>('XENDIT_KEY')
    }

    async createQr(id: string, amount: number): Promise<any> {
        return this.httpService.post(this.apiUrl + '/qr_codes',
            {
                // eslint-disable-next-line @typescript-eslint/camelcase
                external_id: id,
                type: 'DYNAMIC',
                amount: amount,
                // eslint-disable-next-line @typescript-eslint/camelcase
                callback_url: 'https://pringstudio.com/bagidu/callback/' + id
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
}
