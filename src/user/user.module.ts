import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './schemas/user.schema'
import { EventsModule } from 'src/events/events.module'
import { UserResolver } from './graphql/user.resolver'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema }
        ])
    ],
    controllers: [UserController],
    providers: [UserService, UserResolver],
    exports: [UserService]
})
export class UserModule { }
