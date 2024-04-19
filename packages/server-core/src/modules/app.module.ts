import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  NestFactory,
} from '@nestjs/core';

import { resolve } from 'node:path';
import * as cookieParser from 'cookie-parser';

import { GlobalMiddleware } from '../middlewares/global-middleware';
import { GlobalGuard } from '../guards/global-guard';
import { GlobalExceptionFilter } from '../filters/global-exception-filter';
import { GlobalInterceptor } from '../interceptors/global-interceptor';

import { UserModule } from './user/user.module';
import { PassportModule } from './passport/passport.module';
import { OAuth2Module } from './oauth2/oauth2.module';
import { PermissionModule } from './permission/permission.module';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptionsFactory } from './factory/typeorm-options-factory';
import { RedisModule } from '@kazura/nestjs-redis';
import { RedisOptionsFactory } from './factory/redis-options-factory';
import { WinstonModule } from '@kazura/nestjs-winston';
import { WinstonOptionsFactory } from './factory/winston-options-factory';
import { NestLogger } from 'src/utils/nest-logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [resolve(process.cwd(), `env/.env.local`)],
      isGlobal: true,
      expandVariables: true,
    }),
    RedisModule.forRootAsync({
      useClass: RedisOptionsFactory,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptionsFactory,
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonOptionsFactory,
    }),
    UserModule,
    PassportModule,
    OAuth2Module,
    PermissionModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalMiddleware).forRoutes('*');
  }

  static async bootstrap() {
    const logger = new NestLogger();

    logger.log('Starting...', 'AppModule->bootstrap');
    logger.log(
      'process.cwd()  ----->  ' + process.cwd(),
      'AppModule->bootstrap',
    );
    logger.log(
      'process.env.NODE_ENV  ----->  ' + process.env.NODE_ENV,
      'AppModule->bootstrap',
    );
    logger.log(
      'process.env.SERVER_PORT  ----->  ' + process.env.SERVER_PORT,
      'AppModule->bootstrap',
    );
    logger.log(
      'process.env.HTTPS_PROXY  ----->  ' + process.env.HTTPS_PROXY,
      'AppModule->bootstrap',
    );

    const app = await NestFactory.create<NestExpressApplication>(this, {
      cors: true,
      logger,
    });

    // app.set('trust proxy', 1);

    app.disable('x-powered-by');

    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({
        // whitelist: true,
        transform: true,
        validateCustomDecorators: true,
      }),
    );

    await app.listen(parseInt(process.env.SERVER_PORT || '4000', 10));
  }
}
