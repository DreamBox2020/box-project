import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @Column({
    name: 'user_name',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  username?: string;

  @Column({
    name: 'nick_name',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  nikename?: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: true,
    length: 32,
  })
  password?: string;

  @Column({
    name: 'salt',
    type: 'varchar',
    nullable: true,
    length: 32,
  })
  salt?: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    nullable: true,
    length: 20,
  })
  phone?: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
    length: 50,
  })
  email?: string;

  @Column({
    name: 'avatar',
    type: 'varchar',
    nullable: true,
    length: 200,
  })
  avatar?: string;

  @Column({
    name: 'experience',
    type: 'int',
    nullable: true,
    default: () => 0,
  })
  experience!: number;

  @Column({
    name: 'points',
    type: 'int',
    nullable: true,
    default: () => 0,
  })
  points!: number;
}
