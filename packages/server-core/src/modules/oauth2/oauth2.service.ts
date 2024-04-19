import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '@kazura/nestjs-redis';
import { WinstonService } from '@kazura/nestjs-winston';
import { GoogleOauth2Entity } from './entities/google-oauth2.entity';
import { googleOAuth2 } from 'src/utils/google-oauth2';
import { UserInfo } from '@kazura/googleapis';

@Injectable()
export class OAuth2Service {
  constructor(
    @InjectRepository(GoogleOauth2Entity)
    private googleOauth2Repository: Repository<GoogleOauth2Entity>,
    private redisService: RedisService,
    private logger: WinstonService,
  ) {}

  async getUserInfoByGoogleOauth2Code(
    code: string,
    redirectUri: string,
  ): Promise<UserInfo> {
    try {
      return await googleOAuth2().getUserInfo({
        code,
        redirect_uri: redirectUri,
      });
    } catch (error: any) {
      this.logger.error('OAuth2Controller->googleAuthorize->error', {
        error_keys: Object.keys(error),
        error_response_keys: Object.keys(error.response),
        error_response_data: error.response.data,
        error_response_status: error.response.status,
      });
      throw new HttpException('Google授权失败', -400);
    }
  }

  findOneByOpenId(entity: GoogleOauth2Entity | string) {
    const openid =
      entity instanceof GoogleOauth2Entity ? entity.openid : entity;
    return this.googleOauth2Repository.findOneBy({ openid });
  }

  create(entity: GoogleOauth2Entity) {
    const { openid, email, name, givenName, familyName, picture, locale } =
      entity;

    return this.googleOauth2Repository.insert({
      openid,
      email,
      name,
      givenName,
      familyName,
      picture,
      locale,
    });
  }

  updateByOpenId(entity: GoogleOauth2Entity) {
    const { openid, email, name, givenName, familyName, picture, locale } =
      entity;

    return this.googleOauth2Repository.update(
      { openid },
      {
        email,
        name,
        givenName,
        familyName,
        picture,
        locale,
      },
    );
  }

  async save(entity: GoogleOauth2Entity) {
    const result = await this.findOneByOpenId(entity);
    if (result) {
      await this.updateByOpenId(entity);
    } else {
      await this.create(entity);
    }
  }
}
