import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { isProtocol } from 'src/utils';
import { winstonService } from 'src/utils/winston-logger';

export const ProtocolResource = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    winstonService.debug('ProtocolResource->', {
      data,
      body: request.body,
      isProtocol: isProtocol(request.body),
    });

    const contentType = request.headers['content-type'] || '';

    if (contentType.includes('json') && isProtocol(request.body)) {
      try {
        return request.body['resource'];
      } catch (error) {
        winstonService.error('ProtocolResource->Error', error);
      }
    }
    throw new HttpException('Invalid Protocol', -400);
  },
);
