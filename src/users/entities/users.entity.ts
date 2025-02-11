import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => RolesEntity, (role) => role.users)
  role: RolesEntity;
}