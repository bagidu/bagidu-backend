import { MongoMemoryServer } from 'mongodb-memory-server'
import { INestApplication } from '@nestjs/common'
import { createTestApp } from './utils'
import * as CookieParser from 'cookie-parser'
import * as request from 'supertest'
import { UserService } from '../src/user/user.service'
import { XenditService } from '../src/xendit/xendit.service'

describe('Donation Functional', () => {
    let app: INestApplication
    let mongod: MongoMemoryServer

    // Services
    let userService: UserService
    let xendit: XenditService

    beforeEach(async () => {
        const testApp = await createTestApp()
        mongod = testApp.mongo

        const module = await testApp.module.compile()

        app = module.createNestApplication()
        app.use(CookieParser())

        userService = module.get(UserService)
        xendit = module.get(XenditService)

        await app.init()
    })

    afterEach(async () => {
        await app.close()
        await mongod.stop()
    })

    describe('Make Donation', () => {
        const userDTO = {
            name: 'Sucipto',
            username: 'sucipto',
            email: 'sucipto@local.dev',
            password: 'secret'
        }

        it('User not found', () => {
            return request(app.getHttpServer())
                .post('/donation/sucipto')
                .send({
                    name: 'Test Donatur',
                    amount: 1500,
                    message: 'Hello World',
                    payment_method: 'QRIS'
                })
                .expect(404)

        })

        it('QRIS: success create qris donation', async () => {
            const sucipto = await userService.create(userDTO)

            // Mock Xendit
            jest.spyOn(xendit, 'createQr').mockResolvedValueOnce({
                // Fake
                qr_string: '00020101021226690017COM.TELKOMSEL.WWW011893600911002414220002152003260414220010303UME51450015ID.OR.GPNQR.WWW02150000000000000000303UME520454995802ID5920Placeholder merchant6007Jakarta610612345662380115nVQ7anscdgaDyyw0715nVQ7anscdgaDyyw5303360540415006304EC21'
            })

            return request(app.getHttpServer())
                .post(`/donation/${sucipto.username}`)
                .send({
                    name: 'Test Donatur',
                    amount: 1500,
                    message: 'Hello World',
                    payment_method: 'QRIS'
                })
                .expect(201)
                .then(res => {
                    const body = res.body
                    expect(body.amount).toEqual(1500)
                    expect(body.qr).toBeTruthy()
                })
        })
    })
})