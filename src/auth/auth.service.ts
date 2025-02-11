import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    console.log('Kullanıcı:', user); 
    if (!user) {
      console.log('Kullanıcı bulunamadı'); 
      return null;
    }
    console.log('Gönderilen Şifre:', pass); 
    console.log('Hashlenmiş Şifre:', user.password); 
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    console.log('Şifre Doğrulama:', isPasswordValid); // burası main.ts de kontrol etmeden önce yaptığım yerdi şifreler uğuşmuyordu hatayı main.ts den gönderdiğim kayıtta tekrar bcrpyt
    if (isPasswordValid) {                            //şifreliyordum db ye kaydı atarken şifreleme iki kere olunca farklı bir hash kodu gönderiyormuş 
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role.role_name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}