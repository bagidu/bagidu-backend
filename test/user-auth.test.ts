import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { UserService } from '../src/user/user.service'
import { CreateUserDto } from '../src/user/dtos/create-user.dto'
import { AuthService } from '../src/auth/auth.service'
import { User } from 'src/user/entities/user.entity'
import { MongoMemoryServer } from 'mongodb-memory-server'
import * as CookieParser from 'cookie-parser'
import { createTestApp } from './utils'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let userService: UserService
  let authService: AuthService
  let mongod: MongoMemoryServer

  beforeEach(async () => {
    const testApp = await createTestApp()
    mongod = testApp.mongo
    const moduleFixture = await testApp.module.compile()

    app = moduleFixture.createNestApplication()

    userService = moduleFixture.get(UserService)
    authService = moduleFixture.get(AuthService)

    app.use(CookieParser())

    await app.init()
  })

  afterEach(async () => {
    await app.close()
    await mongod.stop()
  })

  describe('/auth', () => {
    const user = new CreateUserDto()
    user.email = 'email@local.dev'
    user.password = 'secret'
    user.username = 'sucipto'

    it('POST /login invalid user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'invalid', password: 'invalid' })
        .expect(401)

    })

    it('POST /login successfully', async done => {
      const sucipto = await userService.create(user)
      expect(sucipto).toBeDefined()

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: user.username, password: user.password })
        .expect(201)
        .then(response => {
          expect(response.body.access_token).toBeDefined()
          expect(response.body.refresh_token).toBeDefined()
          expect(response.header['set-cookie'].length).toEqual(1)
          done()
        })
    })

    it('POST /login unauthorized', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'xx' })
        .expect(401)
    })

    it('GET /profile using token', async () => {
      const sucipto = await userService.create(user)
      expect(sucipto).toBeDefined()
      const auth = await authService.login(sucipto)
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer ' + auth.access_token)
        .expect(200)
    })

    it('POST /token refresh token using cookie', async done => {

      const u: User = await userService.create(user)
      const auth = await authService.login(u)

      return request(app.getHttpServer())
        .post('/auth/token')
        .set('Cookie', [`refresh_token=${auth.refresh_token}`])
        .expect(201)
        .then(response => {
          expect(response.body.access_token).toBeDefined()
          done()
        })
    })

    it('POST /token invalid refresh token return unauthorized', () => {
      return request(app.getHttpServer())
        .post('/auth/token')
        .set('Cookie', ['refresh_token=invalidtoken'])
        .expect(401)
    })

    it('POST /token empty refresh token return unauthorized', () => {
      return request(app.getHttpServer())
        .post('/auth/token')
        .expect(401)
    })

    it('POST /logout return delete refresh token cookie', async done => {
      const u: User = await userService.create(user)
      const auth = await authService.login(u)

      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer ' + auth.access_token)
        .set('Cookie', [`refresh_token=${auth.refresh_token}`])
        .expect(200)
        .then(resp => {
          expect(resp.header['set-cookie'].length).toBe(1)
          expect(resp.header['set-cookie'][0]).toEqual('refresh_token=; Path=/; HttpOnly')
          done()
        })
        .finally(done)
    })

    it('POST /logout without cookie', async done => {
      const u: User = await userService.create(user)
      const auth = await authService.login(u)

      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer ' + auth.access_token)
        .expect(200)
        .then(resp => {
          expect(resp.header['set-cookie'].length).toBe(1)
          expect(resp.header['set-cookie'][0]).toEqual('refresh_token=; Path=/; HttpOnly')
          done()
        })
        .finally(done)
    })
  })

  describe('/user', () => {
    it('GET /me response with user', async () => {
      const user = new CreateUserDto()
      user.email = 'email@local.dev'
      user.password = 'secret'
      user.username = 'sucipto'

      const u: User = await userService.create(user)
      const auth = await authService.login(u)

      return request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', 'Bearer ' + auth.access_token)
        .expect(200)
        .then(resp => {
          expect(resp.body).toEqual(expect.objectContaining({
            email: user.email,
            username: user.username
          }))
        })
    })

    it('GET /username respond with user', async () => {

      const user = new CreateUserDto()
      user.email = 'email@local.dev'
      user.password = 'secret'
      user.username = 'sucipto'

      const u: User = await userService.create(user)
      const auth = await authService.login(u)

      return request(app.getHttpServer())
        .get('/user/' + user.username)
        .set('Authorization', 'Bearer ' + auth.access_token)
        .expect(200)
        .then(resp => {
          expect(resp.body).toEqual(expect.objectContaining({
            email: user.email,
            username: user.username
          }))
        })
    })
  })

})
