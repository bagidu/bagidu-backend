import { Controller, Get, Param } from '@nestjs/common'
import { EventsGateway } from './events.gateway'

@Controller('events')
export class EventsController {
    constructor(private gateway: EventsGateway) { }

    @Get('/:id')
    sendSocket(@Param('id') id: string) {
        this.gateway.server.emit(`alert:${id}`, { message: 'hello alert', name: 'Sucipto', amount: 100000 })
        return 'ok'

    }
}