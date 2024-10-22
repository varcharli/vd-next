import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOneBy: jest.fn().mockResolvedValue(new User()),
            delete: jest.fn().mockResolvedValue(undefined),
            save: jest.fn().mockResolvedValue(new User()), 
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await service.findOne(1);
      expect(result).toBeInstanceOf(User);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });



  describe('create', () => {
    it('should create a user', async () => {
      const user = new User();
      user.id = 1;
      user.name = 'John Doe';
      user.passwordHashed = 'hashed';
      user.isAdmin = false;
      const result = await service.create(user);
      expect(result).toBeInstanceOf(User);
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await service.remove(1);
      expect(result).toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});