import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from './entities/users.entity';
import { RolesEntity } from './entities/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectRepository(RolesEntity)
    private rolesRepository: Repository<RolesEntity>,
  ) {}

  async findAll() {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async findOneByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username }, relations: ['role'] }); // EKstra kullanıcının ismi, id'si ve rol ismine göre arama yapması için get endpointlerini yazdım 
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`Kullanıcı buulunamadı (ID: ${id})`);
    }
    return user;
  }

  async create(createUserDto: any) {
    const { username, password, role } = createUserDto;

    const roleEntity = await this.rolesRepository.findOne({ where: { id: role.id } });
    if (!roleEntity) {
      throw new NotFoundException(`Rol bulunamadı (ID: ${role.id})`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      email: createUserDto.email,
      role: roleEntity,
    });
    return this.usersRepository.save(newUser);
  }

  async findRoleByName(roleName: string) {
    return this.rolesRepository.findOne({ where: { role_name: roleName } });
  }

  async createRole(roleDto: any) {
    const role = this.rolesRepository.create(roleDto);
    return this.rolesRepository.save(role);
  }

  async remove(id: number) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Kullanıcı bulunamadı (ID: ${id})`);
    }
  }
}

