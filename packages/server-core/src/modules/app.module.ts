import { Module, ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOptionsFactory } from './factory/typeorm-options-factory';
import { RedisModule } from './redis';
import { RedisOptionsFactory } from './factory/redis-options-factory';
import { WinstonModule } from 'src/modules/winston';
import { WinstonOptionsFactory } from './factory/winston-options-factory';
import { NestLogger } from 'src/utils/nest-logger';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
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

    app.disable('x-powered-by');

    app.use(cookieParser());

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.listen(parseInt(process.env.SERVER_PORT || '4000', 10));
  }
}
