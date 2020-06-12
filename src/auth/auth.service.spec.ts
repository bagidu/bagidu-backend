import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/user/entities/user.entity'

describe('AuthService', () => {
  let service: AuthService
  let userServie: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findBy: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {}
        }

      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userServie = module.get(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validate user', () => {
    const user = {
      id: 'userid',
      _id: 'userid',
      name: 'user',
      email: 'user@email.com',
      username: 'username',
      createdAt: new Date(),
      password: '$2b$10$48CFoRAeC/yhu5DvRbB2cu.OHsMo1zMxhEXZ.7Jc5AhI0LEZhOakK',
    } as User

    it('resolve user', () => {
      jest.spyOn(userServie, 'findBy').mockReturnValueOnce(Promise.resolve(user))

      return expect(service.validateUser('username', 'secret')).resolves
        .toEqual(user)
    })

    it('resolve null on wrong password', () => {
      jest.spyOn(userServie, 'findBy').mockReturnValueOnce(Promise.resolve(user))

      return expect(service.validateUser('username', 'wrongscret')).resolves
        .toBeNull()
    })

    it('resolve null on wrong user', () => {
      jest.spyOn(userServie, 'findBy').mockReturnValueOnce(Promise.resolve(null))

      return expect(service.validateUser('username', 'secret')).resolves
        .toBeNull()
    })
  })
})
