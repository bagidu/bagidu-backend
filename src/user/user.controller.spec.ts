import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { TestMongoServerModule } from '../mock-mongo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

describe('User Controller', () => {
  let controller: UserController;
  let module: TestingModule
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TestMongoServerModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
      ],
      controllers: [UserController],
      providers: [
        UserService,
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    module.close()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create user', () => {
    it('success create user', async () => {
      const moana = new CreateUserDto()
      moana.name = "Moana"
      moana.username = 'moana'
      moana.email = 'moana@motunui.island'
      moana.password = 'heihei'

      // jest.spyOn(DDD, 'findOne').mockReturnValue(null)

      expect(await controller.create(moana))
        .toEqual(expect.objectContaining({
          name: "Moana",
          username: 'moana',
          email: 'moana@motunui.island'
        }))
      // .to({
      //   name: "Moana",
      //   username: 'moana',
      //   email: 'moana@motunui.island'
      // })
    })
  })
});
