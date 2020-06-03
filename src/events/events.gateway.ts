import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server

  /* istanbul ignore next */
  notify(channel: string, message: object) {
    return this.server.emit(channel, message)
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   console.log('handleMessage', payload)
  //   client.emit('message', 'world')
  //   return 'Hello world!';
  // }
}
