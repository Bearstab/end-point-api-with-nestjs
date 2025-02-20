import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { RolesEntity } from './entities/roles.entity';
import { Repository } from 'typeorm';


const mockUsersRepository = {
    findAll: jest.fn(),
    find: jest.fn(),
}

const mockRolesRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
}

describe('UserService', () => {
    let service: UsersService;
    let usersRepository: Repository<UsersEntity>;
    let rolesRepository: Repository<RolesEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                UsersService,
                {provide: getRepositoryToken(UsersEntity), useValue: mockUsersRepository},
                {provide: getRepositoryToken(RolesEntity), useValue: mockRolesRepository},
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
        rolesRepository = module.get<Repository<RolesEntity>>(getRepositoryToken(RolesEntity));
    })

    it('service atandı mı?', () => {
        expect(service).toBeDefined();
    })

    describe('findAll Methodu düzgün çalışıyor mu ?', () =>{
        it('userların dizisini göstermesi gerekiyor', async () =>{
            const mockUser = [{id: 1, username:'test', role:{role_name:'user'}}]
            mockUsersRepository.find.mockResolvedValue(mockUser);
            const result = await service.findAll();
            expect(result).toEqual(mockUser);
            expect(usersRepository.find).toHaveBeenCalledWith({relations: ['role']})
        })
    })
})


