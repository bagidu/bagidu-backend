import { INestApplication } from "@nestjs/common"
import { TestingModule, Test } from "@nestjs/testing"
import * as request from 'supertest'
import { AppModule } from "../src/app.module"
import { TestMongoServerModule } from "../src/mock-mongo.module"
import { UserService } from "../src/user/user.service"
import { CreateUserDto } from "../src/user/dtos/create-user.dto"

describe('Auth Module (e2e)', () => {
    let app: INestApplication
    let appModule: AppModule
    let userService: UserService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TestMongoServerModule,
                AppModule
            ]
        }).compile();

        app = module.createNestApplication()
        appModule = module.get<AppModule>(AppModule)
        userService = module.get<UserService>(UserService)

        appModule.connection.db.dropDatabase()
        await app.init()
    })

    // beforeEach(async () => {
    //     await appModule.connection.db.dropDatabase()
    // })

    describe('User Login', () => {
        const user = new CreateUserDto()
        user.email = 'email@local.dev'
        user.password = 'secret'
        user.username = 'sucipto'

        userService.create(user)
        it('succesfully authenticated', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ username: user.username, password: user.password })
                .expect(201)
        })
    })

    afterEach(async done => {
        await app.close()
        done()
    })
})