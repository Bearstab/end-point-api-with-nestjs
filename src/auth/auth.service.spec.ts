import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersEntity } from '../users/entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { access } from 'fs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<UsersEntity>;
  let jwtService: JwtService;

  const mockUser = { //mock = sahte nesne , mockUser Sahte user nesnesi üretiyoruz test için
    id: 1,
    username: 'testuser',
    password: '$2b$10$XyQ9rqlj7oPoL9JGyN6DkOWhqde5Uq3lzVBCm7AGxNwlf/xBD5QeC',
    role: { role_name: 'user' },
  };

  const mockRepository = {
    findOne: jest.fn(), //Gerçek usersRepository yerine mock (sahte) bir repository oluşturuyoruz.
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'), //jest.fn() → Jest’in bir mock fonksiyon oluşturmasını sağlar. 
    //mockReturnValue('mocked-jwt-token') → Bu fonksiyon her çağrıldığında 'mocked-jwt-token' değerini döndürür.
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, //Test etmek istediğimiz asıl servis.
        { provide: getRepositoryToken(UsersEntity), useValue: mockRepository }, //NestJS’in TypeORM kullanarak User tablosu için oluşturduğu repository'yi (depolama katmanı) temsil eder.
        //Gerçek veritabanı yerine, taklit edilen repository'yi (mockRepository) kullan.
        { provide: JwtService, useValue: mockJwtService }, //Gerçek JWT yerine mockJwtService kullanılacak.Bu sayede gerçek token oluşturulmaz, sadece sahte bir değer döndürülür.
      ],
    }).compile(); //Test modülünü derleyip çalıştırmaya hazır hale getiriyoruz.  Tüm bağımlılıklar hazırlandıktan sonra, modülü kullanabilir hale getiriyoruz.
   
    authService = module.get<AuthService>(AuthService); //Test etmek istediğimiz AuthService'i oluşturduk.
    usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity)); //Gerçek veritabanı yerine mock repository kullanacağız.
    jwtService = module.get<JwtService>(JwtService); //Gerçek JWT işlemi yerine sahte bir JWT servisi kullanacağız
  });

  it('authservice belirlenmiş mi?', () => {
    expect(authService).toBeDefined(); // Jest'in beklenti (assertion) fonksiyonudur. toBeDefined() → Eğer authService tanımlıysa (undefined değilse), test başarılı olur.
  });

  describe('validateUser', () => { // describe fonksiyonu, test grubunu belirler."validateUser" metodu için bir grup test oluşturuyoruz.
    it('şifre doğru ise şifre olmadan döndür', async () =>{ // it fonksiyonu, tek bir test senaryosunu tanımlar. Testin amacı: Şifre doğruysa, kullanıcı parolasız olarak dönmelidir.
      mockRepository.findOne.mockResolvedValue(mockUser); // mockRepository.findOne metodunu taklit ediyoruz (mocking). mockUser adlı test kullanıcısını döndürmesini sağlıyoruz.
      // Gerçekte veritabanı sorgusu yapmadan, istediğimiz test verisini döndürüyoruz.
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);// Normalde bcrypt, girilen şifreyi hash ile karşılaştırır. Burada doğrudan true dönmesini sağlıyoruz (şifre eşleştiğini varsayıyoruz).
      
      const result= await authService.validateUser('testuser', 'password');// authService.validateUser metodunu çağırıyoruz. "testuser" kullanıcı adını ve "password" şifresini gönderiyoruz.
      //Beklentimiz: Eğer şifre doğruysa, password alanı çıkarılmış bir kullanıcı nesnesi döndürmelidir.
      expect(result).toEqual({id: 1, username: 'testuser', role:{role_name: 'user'}});//expect().toEqual() ile dönen sonucu test ediyoruz.
      //Şifre doğru olduğunda dönen kullanıcı nesnesinde password olmamalıdır.
    });
  });
  describe('Login', () =>{ //Login methodunu çağırıyoruz test grubu içerisinde 
    it('erişim tokeni dönmesi gerek', async() =>{ 
      const result = await authService.login(mockUser); //uydurulmuş user nesnesini çağırdık
      expect(result).toEqual({access_token: 'mocked-jwt-token'}); //uydurulmuş jwt tokeni atıyoruz
      expect(mockJwtService.sign).toHaveBeenCalledWith({ //belirtilen nesneler ile çalışıp çalışılmadığına bakılıyor
        username: 'testuser', //nesneler 
        sub: 1,
        role: 'user',
      });
    });
  });
});
