import { Injectable } from '@nestjs/common';
import { PassportEntity } from './entities/passport.entity';
import {
  deserializeInstance,
  generateToken,
  serializeInstance,
} from 'src/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@kazura/nestjs-redis';
import { WinstonService } from '@kazura/nestjs-winston';

@Injectable()
export class PassportService {
  static PASSPORT_KEY_PREFIX = 'passport:';

  constructor(
    @InjectRepository(PassportEntity)
    private passportRepository: Repository<PassportEntity>,
    private redisService: RedisService,
    private logger: WinstonService,
  ) {}

  private saveToCache(passport: PassportEntity) {
    return this.redisService.getClient().set(
      PassportService.PASSPORT_KEY_PREFIX + passport.token,
      serializeInstance(passport),
      'EX',
      60 * 60 * 24 * 30, // 30天
    );
  }

  private removeCache(passport: PassportEntity | string) {
    const token =
      passport instanceof PassportEntity ? passport.token : passport;
    return this.redisService
      .getClient()
      .del(PassportService.PASSPORT_KEY_PREFIX + token);
  }

  private async readFromCache(passport: PassportEntity | string) {
    const token =
      passport instanceof PassportEntity ? passport.token : passport;
    const passportPlain = await this.redisService
      .getClient()
      .get(PassportService.PASSPORT_KEY_PREFIX + token);
    this.logger.debug(
      'PassportService->readFromCache->passportPlain',
      passportPlain,
    );

    if (passportPlain) {
      const entity = deserializeInstance(PassportEntity, passportPlain);
      this.logger.debug('PassportService->readFromCache->entity', entity);
      return entity;
    }

    return null;
  }

  /**
   * 根据通行证的token查找通行证
   * @param passport
   * @param fromCache 是否从缓存中读取
   * @returns
   */
  async findOneByToken(passport: PassportEntity | string, fromCache = true) {
    const token =
      passport instanceof PassportEntity ? passport.token : passport;
    if (fromCache) {
      return this.readFromCache(token);
    } else {
      const entity = await this._findOneByToken(token);
      await this.saveToCache(entity!);
      return entity;
    }
  }

  async create(passport: PassportEntity) {
    const insertResult = await this._create(passport);
    this.logger.debug('PassportService->create->insertResult', insertResult);
    passport.id = insertResult.identifiers[0].id;

    const entity = await this.findOneById(passport);
    this.logger.debug('PassportService->create->entity', entity);
    await this.saveToCache(entity!);
    return entity;
  }

  /**
   * 创建一个游客，userId 为 undefined。
   * @param passport
   * @returns
   */
  createGuest(passport: PassportEntity) {
    passport.userId = undefined;
    return this.create(passport);
  }

  /**
   * 延长有效期，会根据 newPassport 更新 updatedAt、userAgent、ipAddress 字段。
   * @param oldPassport
   * @param newPassport
   * @returns
   */
  async extendValidity(
    oldPassport: PassportEntity,
    newPassport: PassportEntity,
  ) {
    newPassport.token = oldPassport.token;
    return this.updateWithoutUserId(newPassport);
  }

  /**
   * 过期一个 passport，会根据 passport 的 token 删除缓存。
   * @param passport
   * @returns
   */
  async expire(passport: PassportEntity | string) {
    await this.deleteByToken(passport);
    return this.removeCache(passport);
  }

  /**
   * 更新数据库中的 passport，会更新userId。
   * @param passport
   * @returns
   */
  signIn(passport: PassportEntity) {
    return this.updateWithUserId(passport);
  }

  /**
   * 更新通行证，不更新userId
   * @param passport
   * @returns
   */
  async updateWithoutUserId(passport: PassportEntity) {
    await this._updateWithoutUserId(passport);
    const entity = await this.findOneByToken(passport, false);
    return entity;
  }

  /**
   * 更新通行证，同时允许更新userId
   * @param passport
   * @returns
   */
  async updateWithUserId(passport: PassportEntity) {
    await this._updateWithUserId(passport);
    const entity = await this.findOneByToken(passport, false);
    return entity;
  }

  findOneById(passport: PassportEntity | number) {
    const id = passport instanceof PassportEntity ? passport.id : passport;
    return this.passportRepository.findOneBy({ id });
  }

  _findOneByToken(passport: PassportEntity | string) {
    const token =
      passport instanceof PassportEntity ? passport.token : passport;
    return this.passportRepository.findOneBy({ token });
  }

  _create(passport: PassportEntity) {
    const { userId, userAgent, ipAddress, clientIdentifier } = passport;
    const token = generateToken();
    return this.passportRepository.insert({
      token,
      userId,
      userAgent,
      ipAddress,
      clientIdentifier,
    });
  }

  /**
   * 更新通行证，不更新userId
   * @param passport
   * @returns
   */
  _updateWithoutUserId(passport: PassportEntity) {
    passport.userId = undefined;
    return this.updateWithUserId(passport);
  }

  /**
   * 更新通行证，同时允许更新userId
   * @param passport
   * @returns
   */
  _updateWithUserId(passport: PassportEntity) {
    const { token, userId, userAgent, ipAddress } = passport;
    return this.passportRepository.update(
      { token },
      {
        userId,
        userAgent,
        ipAddress,
      },
    );
  }

  deleteByUserId(passport: PassportEntity | number) {
    const userId =
      passport instanceof PassportEntity ? passport.userId : passport;
    return this.passportRepository.softDelete({ userId });
  }

  deleteByToken(passport: PassportEntity | string) {
    const token =
      passport instanceof PassportEntity ? passport.token : passport;
    return this.passportRepository.softDelete({ token });
  }
}
