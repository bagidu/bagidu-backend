import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
  let service: AuthService;
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
    }).compile();

    service = module.get<AuthService>(AuthService);
    userServie = module.get(UserService)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('validate user', async () => {
    const password = await bcrypt.hash('secret', 10)
    const user = {
      id: 'userid',
      _id: 'userid',
      name: 'user',
      email: 'user@email.com',
      username: 'username',
      createdAt: new Date(),
      password
    }
    jest.spyOn(userServie, 'findBy').mockReturnValue(Promise.resolve(user))
    expect(service.validateUser('username', 'secret')).resolves
      .toEqual(user)
      .catch(err => expect(err).toBeNull())

    expect(service.validateUser('username', 'wrongsecret')).resolves
      .toBeNull()
      .catch(err => expect(err).toBeNull())
  })
});
