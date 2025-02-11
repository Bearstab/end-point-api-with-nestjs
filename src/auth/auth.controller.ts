import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: { username: string; password: string }) {
    const user = await this.authService.validateUser(credentials.username, credentials.password); //auth.service deki validateuser methodunu çekiyoruz
    if (!user) {
      throw new Error('Invalid credentials'); // internal exception atıyoz zaten 
    }
    return this.authService.login(user);
  }
}