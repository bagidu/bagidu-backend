import { Type } from 'class-transformer'

export class XenditQrDto {
    id: string
    external_id: string
    qr_string: string
    type: string
}

export class XenditCallbackDto {
    event: string
    id: string
    amount: number
    created: string
    @Type(() => XenditQrDto)
    qr_code: XenditQrDto
    status: string
}
