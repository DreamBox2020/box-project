import { HttpException, Injectable } from '@nestjs/common';
import { generateUUID, md5 } from 'src/utils';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WinstonService } from '@kazura/nestjs-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private logger: WinstonService,
  ) {}

  async loginByUserName(user: UserEntity) {
    const entity = await this.findOneByUserName(user);
    this.logger.debug('UserService->loginByUserName', entity);
    if (entity) {
      const password_salt = md5(user.password! + entity.salt!);
      this.logger.debug(
        'UserService->loginByUserName->password_salt',
        password_salt,
      );
      if (password_salt === entity.password) {
        return entity;
      }
    }
    return null;
  }

  async registerByUserName(user: UserEntity) {
    const entity = await this.findOneByUserName(user);
    if (entity) {
      this.logger.debug('UserService->registerByUserName', entity);
      throw new HttpException('用户名已存在', -400);
    }
    return this.createByUserName(user);
  }

  findOneById(user: UserEntity | number) {
    const id = user instanceof UserEntity ? user.id : user;
    return this.userRepository.findOneBy({ id });
  }

  findOneByUserName(user: UserEntity | string) {
    const username = user instanceof UserEntity ? user.username : user;
    return this.userRepository.findOneBy({ username });
  }

  findOneByPhone(user: UserEntity | string) {
    const phone = user instanceof UserEntity ? user.phone : user;
    return this.userRepository.findOneBy({ phone });
  }

  findOneByEmail(user: UserEntity | string) {
    const email = user instanceof UserEntity ? user.email : user;
    return this.userRepository.findOneBy({ email });
  }

  createByUserName(user: UserEntity) {
    const { username, password } = user;

    const salt = generateUUID();
    const password_salt = md5(password + salt);

    return this.userRepository.insert({
      username,
      password: password_salt,
      salt,
    });
  }

  createByPhone(user: UserEntity | string) {
    const phone = user instanceof UserEntity ? user.phone : user;

    return this.userRepository.insert({
      phone,
    });
  }

  /**
   * 如果已经注册过，直接返回。否则创建用户
   * @param user
   * @returns
   */
  async createByEmail(user: UserEntity | string): Promise<UserEntity> {
    // 如果已经注册过，直接返回
    let userEntity = await this.findOneByEmail(user);

    if (userEntity) {
      return userEntity;
    }

    const email = user instanceof UserEntity ? user.email : user;

    await this.userRepository.insert({
      email,
      nikename: user instanceof UserEntity ? user.nikename : undefined,
      avatar: user instanceof UserEntity ? user.avatar : undefined,
    });

    // 注册成功后，再次查询
    userEntity = await this.findOneByEmail(user);

    if (!userEntity) {
      throw new HttpException('创建用户失败', -400);
    }

    return userEntity;
  }

  updateById(user: UserEntity) {
    const { id, nikename, avatar } = user;
    return this.userRepository.update(
      { id },
      {
        nikename,
        avatar,
      },
    );
  }
}
