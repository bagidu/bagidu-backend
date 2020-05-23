import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserService } from '../src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserDto } from '../src/user/dtos/create-user.dto';
import { AuthService } from '../src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService
  let authService: AuthService
  let mongod: MongoMemoryServer

  beforeEach(async () => {
    mongod = new MongoMemoryServer()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            return {
              uri: await mongod.getUri(),
              useNewUrlParser: true,
              useUnifiedTopology: true,
              useCreateIndex: true,
            }
          }
        }),
        AuthModule,
        UserModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    userService = moduleFixture.get(UserService)
    authService = moduleFixture.get(AuthService)

    await app.init();
  });

  afterEach(async () => {
    await app.close()
    await mongod.stop()
  })


  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');

  // });

  describe('/auth', () => {
    const user = new CreateUserDto()
    user.email = 'email@local.dev'
    user.password = 'secret'
    user.username = 'sucipto'

    it('/login invalid user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'invalid', password: 'invalid' })
        .expect(401)

    })

    it('/login successfully', async done => {
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

    it('/login unauthorized', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'xx' })
        .expect(401)
    })

    it('get profile using token', async () => {
      const sucipto = await userService.create(user)
      expect(sucipto).toBeDefined()
      const auth = await authService.login(sucipto)
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer ' + auth.access_token)
        .expect(200)
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

});
