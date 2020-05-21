import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { User as UserEntity } from './entities/user.entity'

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>

  class MockModel {
    constructor(private data: any) { }
    save = jest.fn().mockResolvedValue({ toObject: () => { return { hello: 'world' } } })
    static find = jest.fn()
    static findOne = jest.fn()
    static findOneAndUpdate = jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: MockModel
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken('User'))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create user', () => {
    const dto = { name: 'name', email: 'email', username: 'username', password: 'pass', createdAt: null }
    // jest.spyOn(MockModel.prototype, 'save')//.mockResolvedValue({ toObject: () => { return {} } })
    return expect(service.create(dto)).resolves.toEqual(expect.objectContaining({ hello: 'world' }))
  })

  it('return all user', () => {
    const results = [
      { name: 'user1' },
      { name: 'user2' }
    ]
    jest.spyOn(model, 'find').mockImplementation((): any => {
      return {
        lean: () => results
      }
    })
    return expect(service.all()).resolves.toEqual(results)
  })

  it('findByID by username return one user', () => {
    jest.spyOn(model, 'findOne').mockImplementation((): any => {
      return {
        lean: () => ({})
      }
    })
    return expect(service.findById('id')).toBeDefined()
  })

  it('findByID by objectId return one user', () => {
    jest.spyOn(model, 'findOne').mockImplementation((): any => {
      return {
        lean: () => ({})
      }
    })
    return expect(service.findById('5ea4e394b38ba83227a89b11')).toBeDefined()
  })

  it('findBy return one user', () => {

    jest.spyOn(model, 'findOne').mockImplementation((): any => {
      return {
        lean: () => ({})
      }
    })
    return expect(service.findBy({ email: 'mock' })).toBeDefined()
  })

  it('user return id by getter', () => {
    const user = new UserEntity()
    user._id = 'someid'
    expect(user.id).toEqual(user._id)
  })

  // it('save token', () => {
  //   service.saveToken()
  // })
});
