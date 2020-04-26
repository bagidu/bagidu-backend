import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { TestMongoServerModule } from '../mock-mongo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      imports: [
        TestMongoServerModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
