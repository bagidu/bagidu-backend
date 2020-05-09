import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Donation } from '../donation/entities/donation.entity';

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

    async createQr(id:string,amount:number):Promise<any> {
        try {
            const response = await this.httpService.post(this.apiUrl + '/qr_codes',
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
            ).toPromise()

            console.log('create_qr', response.data)
            return response.data
        } catch (err) {
            console.log('error call xendit api', err)
        }
    }
}
