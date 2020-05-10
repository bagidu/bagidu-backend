import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findBy: jest.fn(),
            create: jest.fn(),
            findById: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService)
  });

  afterEach(() => {
    module.close()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    const moana = new CreateUserDto()
    moana.name = "Moana"
    moana.username = 'moana'
    moana.email = 'moana@motunui.island'
    moana.password = 'heihei'

    it('success create user', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        const user = new User()
        user.name = "Moana"
        user.username = 'moana'
        user.email = 'moana@motunui.island'
        user.password = 'heihei'
        return Promise.resolve(user)
      })

      jest.spyOn(service, 'findBy').mockReturnValueOnce(Promise.resolve(null))

      return expect(await controller.create(moana))
        .toEqual(expect.objectContaining({
          name: "Moana",
          username: 'moana',
          email: 'moana@motunui.island'
        }))
    })

    it('bad request on email in use', () => {
      jest.spyOn(service, 'findBy').mockImplementationOnce((q): Promise<User> => {
        if (q.email === 'moana@motunui.island') {
          return Promise.resolve(new User())
        } else {
          return Promise.resolve(null)
        }
      })

      return expect(controller.create(moana))
      .rejects
      .toThrow(BadRequestException)
    })

    it('bad request on username in used', async () => {
      jest.spyOn(service, 'findBy').mockImplementation((q): Promise<User> => {
        if (q.username === moana.username) {
          return Promise.resolve(new User())
        } else {
          return Promise.resolve(null)
        }
      })

      return expect(controller.create(moana))
        .rejects
        .toThrow(BadRequestException)
    })

    it('/me return user', () => {
      const user = new User()
      user._id = '123'
      user.name = 'User Satu'

      jest.spyOn(service, 'findById').mockResolvedValue(user)

      expect(controller.profile({ user: { id: '123' } })).resolves.toEqual(user)
    })
  })

});
