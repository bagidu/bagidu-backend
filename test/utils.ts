import { MongoMemoryServer } from 'mongodb-memory-server'
import { TestingModuleBuilder, TestingModule, Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

class AppTest {
    mongo: MongoMemoryServer
    module: TestingModuleBuilder
}
export async function createTestApp(): Promise<AppTest> {
    const mongo = new MongoMemoryServer()
    const mongoURI = await mongo.getUri()

    const module: TestingModuleBuilder = await Test.createTestingModule({
        imports: [
            AppModule
        ],
    })
        .overrideProvider('MongooseModuleOptions')
        .useValue({
            uri: mongoURI,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })

    return {
        mongo,
        module
    }
}