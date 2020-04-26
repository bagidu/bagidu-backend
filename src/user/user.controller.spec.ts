import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { getModelToken } from '@nestjs/mongoose';
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
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {}
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

      jest.spyOn(service, 'findBy').mockReturnValue(Promise.resolve(null))

      expect(await controller.create(moana))
        .toEqual(expect.objectContaining({
          name: "Moana",
          username: 'moana',
          email: 'moana@motunui.island'
        }))
    })

    it('bad request on username or email in use', async () => {
      jest.spyOn(service, 'findBy').mockReturnValue(Promise.resolve(new User()))
      expect(controller.create(moana)).rejects.toThrow(BadRequestException)
    })
  })
});
