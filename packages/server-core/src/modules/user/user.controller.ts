import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { Exception, Exceptions } from 'src/filters/exceptions';
import { Result } from 'src/utils/result';
import { UserRegisterUserName } from './dtos/user-register-username.dto';
import { UserService } from './user.service';
import { googleCaptcha } from 'src/utils/google-captcha';
import { ReqPassport } from 'src/decorators/req-passport';
import { PassportEntity } from 'src/modules/passport/entities/passport.entity';
import { PassportService } from 'src/modules/passport/passport.service';
import { PermissionService } from 'src/modules/permission/permission.service';
import { WinstonService } from '@kazura/nestjs-winston';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private passportService: PassportService,
    private permissionService: PermissionService,
    private logger: WinstonService,
  ) {}

  @Post('/login/username')
  async loginByUserName(
    @ProtocolResource() resource: UserRegisterUserName,
    @ReqPassport(true) passport: PassportEntity,
  ) {
    if (passport.userId) {
      throw new Exception(Exceptions.DuplicateLogin);
    }

    this.logger.debug('UserController->loginByUserName', resource);

    const user = new UserEntity();
    user.username = resource.username;
    user.password = resource.password;

    const data = await googleCaptcha().verify(resource.response);
    this.logger.debug('UserController->loginByUserName->captcha', data);

    if (!data.success) {
      throw new Exception(Exceptions.CaptchaError);
    }

    const userEntity = await this.userService.loginByUserName(user);

    if (!userEntity) {
      throw new Exception(Exceptions.LoginError);
    }

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
}
