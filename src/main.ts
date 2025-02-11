import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  const userService = app.get(UsersService);
  const existingUser = await userService.findOneByUsername('admin');
  if (!existingUser) {
    await userService.create({
      username: 'admin',
      password: '123', // Düz metin şifre
      email: 'admin@example.com',
      role: { id: 1 }, // Admin rolüne sahip kullanıcı
    });
    console.log('İlk Kullanıcı(admin) oluşturıldu');
  }
  /*async function testBcrypt() { //db ve login postunda girdiğim şifreler uyuşmuyordu bcrytp şiflemeyi test ettim
  const plainPassword = '123'; 
  const hashedPassword = '$2b$10$fLSyCv9FaVYpUNlYNb0yx..oPJvuuvnahL71XCgbeUvl54ekBQTWG'; 
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Şifre Doğrulama:', isValid);
  }
  testBcrypt();*/
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

