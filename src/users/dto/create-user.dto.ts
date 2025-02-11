import { IsString, MinLength, IsInt, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  email: string;

  @IsBoolean()
  isActive: boolean;

  @IsInt()
  role_id: number;
}