import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { MongoMemoryServer } from 'mongodb-memory-server'
@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => {
                const mongod = new MongoMemoryServer()
                const uri = await mongod.getConnectionString()
                return {
                    uri,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
                }
            }
        })
    ]
})
export class TestMongoServerModule { }