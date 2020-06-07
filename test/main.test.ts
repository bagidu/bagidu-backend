import { INestApplication } from '@nestjs/common'
import { createTestApp } from './utils'
import { MongoMemoryServer } from 'mongodb-memory-server'
import * as request from 'supertest'

describe('Main App', () => {
    let app: INestApplication
    let mongod: MongoMemoryServer

    beforeEach(async () => {
        const testApp = await createTestApp()
        mongod = testApp.mongo

        const module = await testApp.module.compile()
        app = module.createNestApplication()

        await app.init()
    })

    afterEach(async () => {
        await app.close()
        await mongod.stop()
    })

    describe('Main controller', () => {
        it('return main message', () => {
            return request(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect('Diam itu emas 🤪')
        })
    })
})