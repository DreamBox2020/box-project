import { Controller, Post, Req } from '@nestjs/common';
import { PassportService } from './passport.service';
import { Result } from 'src/utils/result';
import { PassportEntity } from './entities/passport.entity';
import { Request } from 'express';
import { ReqPassport } from 'src/decorators/req-passport';
import { ProtocolResource } from 'src/decorators/protocol-resource';
import { PermissionService } from '../permission/permission.service';
import { WinstonService } from '@kazura/nestjs-winston';

@Controller('/passport')
export class PassportController {
  constructor(
    private passportService: PassportService,
    private permissionService: PermissionService,
    private logger: WinstonService,
  ) {}

  @Post('/create')
  async create(
    @ReqPassport() passport: PassportEntity | null,
    @ProtocolResource() resource: { clientIdentifier?: string },
    @Req() req: Request,
  ) {
    this.logger.debug('PassportController->create->passport', passport);
    this.logger.debug('PassportController->create->req->ip', req.ip);
    const entity = new PassportEntity();
    entity.userAgent = req.headers['user-agent'];
    entity.ipAddress = req.ip;
    entity.clientIdentifier = resource.clientIdentifier || 'unknown';

    // 如果meta里面存在通行证，说明 旧的通行证没有过期，需要延长有效期。否则创建新的通行证
    if (passport) {
      const oldPassport = await this.passportService.extendValidity(
        passport,
        entity,
      );

      return new Result({
        passport: oldPassport,
        user: req.__user,
        statements: this.permissionService.getStatementsByRoleEntities(
          req.__roles,
        ),
      });
    } else {
      const newPassport = await this.passportService.create(entity);
      return new Result({
        passport: newPassport,
        user: null,
        statements: [],
      });
    }
  }
}
