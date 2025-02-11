import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/entities/users.entity';
import { RolesEntity } from './users/entities/roles.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: "postgres",
      password: "123",
      database: "users",
      entities: [UsersEntity, RolesEntity],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
//usersentity ve rolesentity olarak değiştirdim userrole kafa karıştırıyordu
//db ismi users olarak değişti ve postgre17 kullanıyor artık