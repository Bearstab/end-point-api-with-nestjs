import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { RolesEntity } from './entities/roles.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<UsersEntity>;
  let rolesRepository: Repository<RolesEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RolesEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
    rolesRepository = module.get<Repository<RolesEntity>>(getRepositoryToken(RolesEntity));
  });

  
  
  const User: UsersEntity = {
    id: 1,
    username: 'usert', 
    password: '123',
    email: '123',
    isActive: true,
    role: { id: 1, role_name: '123', users: [] } as RolesEntity,
  };
  
  beforeEach(() => {
    jest.clearAllMocks(); // Önceki mockları temizle
  });
  
  it('should return a user by username', async () => {
    const dynamicUser = { ...User, username: 'changedUsername' }; // Kullanıcı nesnesini güncelliyoruz
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(dynamicUser);
  
    const result = await service.findOneByUsername('changedUsername');
  
    console.log('🟢 Güncellenmiş Kullanıcı:', dynamicUser);
    console.log('🔵 Dönen Sonuç:', result);
  
    expect(JSON.stringify(result)).toEqual(JSON.stringify(dynamicUser)); // Derin karşılaştırma
  });
  
  /*const User: UsersEntity = {
    id: 1,
    username: 'USER',
    password: '123',
    email: '123',
    isActive: true,
    role: { id: 1, role_name: '123', users: [] } as RolesEntity,
  };

  it('should return a user by username', async () => {
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(User);
  
    const result = await service.findOneByUsername('123');
  
    expect(result).toEqual(User);
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { username: '123' },
      relations: ['role'],
    });
  });*/

  it('should return null if username not found', async () => {
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
  
    const result = await service.findOneByUsername('unknownUser');
  
    expect(result).toBeNull();
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'unknownUser' },
      relations: ['role'],
    });
  });
});
