import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Protocol } from 'src/dtos/protocol-dto';
import { PassportService } from 'src/modules/passport/passport.service';
import { PermissionService } from 'src/modules/permission/permission.service';
import { UserService } from 'src/modules/user/user.service';
import { WinstonService } from '@kazura/nestjs-winston';
import { isProtocol } from 'src/utils';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private passportService: PassportService,
    private permissionService: PermissionService,
    private logger: WinstonService,
  ) {}

  async use(request: Request, response: Response, next: NextFunction) {
    request.__user = null;
    request.__passport = null;
    request.__roles = [];

    const token = this.getPassportFromRequest(request);

    // 如果token不为空，则初始化上下文
    await this.initializeContext(request, token);

    next();
  }

  async initializeContext(request: Request, token: string | null) {
    // 如果token为空，则直接返回
    if (!token) return;

    // 查询通行证信息
    const entity = await this.passportService.findOneByToken(token);
    if (entity) {
      request.__passport = entity;
      // 如果通行证绑定了用户，则查询用户信息，和用户的角色信息
      if (entity.userId) {
        request.__user = await this.userService.findOneById(entity.userId);
        request.__roles = await this.permissionService.getRolesByUserId(
          entity.userId,
        );
      }
    }

    // 如果查不到，则当作游客处理
  }

  /**
   * 从请求中获取通行证
   * @param request
   * @returns
   */
  getPassportFromRequest(request: Request) {
    const contentType = request.headers['content-type'] || '';

    // 如果是json格式的请求体，且包含passport字段，则从请求体中获取passport
    if (contentType.includes('json') && isProtocol(request.body)) {
      const { passport } = request.body;

      this.logger.debug('NestMiddleware->getPassportFromRequest', {
        contentType,
        passport,
      });

      return passport;
    }

    if (
      // 如果是其他格式的请求体，则从cookie中获取passport
      '__PASSPORT' in request.cookies &&
      typeof request.cookies['__PASSPORT'] === 'string'
    ) {
      const passport = request.cookies['__PASSPORT'];

      this.logger.debug('NestMiddleware->getPassportFromRequest', {
        contentType,
        passport,
      });

      return passport;
    }

    // 否则返回null
    this.logger.debug('NestMiddleware->getPassportFromRequest', {
      contentType,
      passport: null,
    });
    return null;
  }
}
