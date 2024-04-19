import { Controller, HttpException, Post } from '@nestjs/common';
import { OAuth2Service } from './oauth2.service';
import { googleOAuth2 } from 'src/utils/google-oauth2';
import { Result } from 'src/utils/result';
import { WinstonService } from '@kazura/nestjs-winston';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { GoogleAuthorizeDTO, GoogleRedirectDTO } from './dtos';
import { ReqPassport } from 'src/decorators/req-passport';
import { PassportEntity } from '../passport/entities/passport.entity';
import { isGmailEmail } from 'src/utils/check';
import { isString } from 'class-validator';
import { GoogleOauth2Entity } from './entities/google-oauth2.entity';
import { UserService } from '../user/user.service';
import { PassportService } from '../passport/passport.service';
import { PermissionService } from '../permission/permission.service';
import { Exception, Exceptions } from 'src/filters/exceptions';
import { UserEntity } from '../user/entities/user.entity';

@Controller('/oauth2')
export class OAuth2Controller {
  constructor(
    private oauth2Service: OAuth2Service,
    private userService: UserService,
    private passportService: PassportService,
    private permissionService: PermissionService,
    private logger: WinstonService,
  ) {}

  @Post('/google/redirect')
  async googleRedirect(@ProtocolResource() resource: GoogleRedirectDTO) {
    this.logger.debug('OAuth2Controller->googleRedirect->resource', resource);

    const redirectUri = googleOAuth2().generateAuthUrl({
      access_type: 'online',
      prompt: 'select_account',
      redirect_uri: resource.redirectUri,
      scope: ['profile', 'email', 'openid'],
      state: 'state',
    });

    this.logger.debug('OAuth2Controller->google->redirectUri', redirectUri);

    return new Result({ redirectUri });
  }

  @Post('/google/authorize')
  async googleAuthorize(
    @ProtocolResource() resource: GoogleAuthorizeDTO,
    @ReqPassport(true) passport: PassportEntity,
  ) {
    if (passport.userId) {
      throw new Exception(Exceptions.DuplicateLogin);
    }

    this.logger.debug('OAuth2Controller->googleAuthorize->resource', resource);

    const data = await this.oauth2Service.getUserInfoByGoogleOauth2Code(
      resource.code,
      resource.redirectUri,
    );

    this.logger.info('OAuth2Controller->googleAuthorize->data', data);

    if (isString(data.email) && isGmailEmail(data.email) && isString(data.id)) {
      const entity = new GoogleOauth2Entity();
      entity.openid = data.id;
      entity.email = data.email;
      entity.name = data.name || undefined;
      entity.givenName = data.given_name || undefined;
      entity.familyName = data.family_name || undefined;
      entity.picture = data.picture || undefined;
      entity.locale = data.locale || undefined;

      // 在数据库中保存 最新的数据，无需 await。
      this.oauth2Service.save(entity);

      let userEntity = new UserEntity();
      userEntity.email = entity.email;
      userEntity.nikename = entity.name;
      userEntity.avatar = entity.picture;
      userEntity = await this.userService.createByEmail(userEntity);

      passport.userId = userEntity.id;
      const passportEntity = await this.passportService.updateWithUserId(
        passport,
      );

      const roleEntities = await this.permissionService.getRolesByUserId(
        userEntity,
      );

      return new Result({
        passport: passportEntity,
        user: userEntity,
        statements:
          this.permissionService.getStatementsByRoleEntities(roleEntities),
      });
    }

    throw new HttpException('Google授权失败', -400);
  }
}
