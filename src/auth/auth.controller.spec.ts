import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { Response } from 'express'

describe('Auth Controller', () => {
  let controller: AuthController
  // let authService: AuthService;
  // let userService: UserService;
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            saveToken: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn()
          }
        }
      ]
    })
      .compile()

    controller = module.get<AuthController>(AuthController)
    // authService = module.get(AuthService)
    // userService = module.get(UserService)
    jwtService = module.get(JwtService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('/login able to login and get token', async () => {
    const res = {
      cookie: jest.fn(),
      send: jest.fn()
    } as unknown as Response

    jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token')

    await controller.login(
      { user: { username: 'username', password: 'password' } },
      res
    )

    expect(res.send).toHaveBeenCalled()
  })

  it('/profile return data on authenticated user', () => {
    expect(controller.profile({ user: { username: 'mock' } }))
      .resolves
      .toEqual({ username: 'mock' })
      .catch(e => expect(e).toBeNull())
  })
})
