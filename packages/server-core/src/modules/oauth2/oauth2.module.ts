import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth2Service } from './oauth2.service';
import { OAuth2Controller } from './oauth2.controller';
import { GoogleOauth2Entity } from './entities/google-oauth2.entity';
import { UserModule } from '../user/user.module';
import { PassportModule } from '../passport/passport.module';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    PermissionModule,
    TypeOrmModule.forFeature([GoogleOauth2Entity]),
  ],
  providers: [OAuth2Service],
  controllers: [OAuth2Controller],
  exports: [TypeOrmModule, OAuth2Service],
})
export class OAuth2Module {}
