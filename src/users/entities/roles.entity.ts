import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('roles') //tablo adını roles olarak değiştirdim userrole yerine, karışıklık yaratıyordu
export class RolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  role_name: string;

  @OneToMany(() => UsersEntity, (user) => user.role)
  users: UsersEntity[];
}