import { Controller, Get, Param } from '@nestjs/common'
import { EventsGateway } from './events.gateway'

@Controller('events')
export class EventsController {
    constructor(private gateway: EventsGateway) { }

    @Get('/:id')
    /*istanbul ignore next*/
    sendSocket(@Param('id') id: string) {
        this.gateway.notify(`alert:${id}`, { message: 'Hello, ini test alert saja, 🤗', name: 'Test Alert', amount: 100000 })
        return 'ok'

    }
}