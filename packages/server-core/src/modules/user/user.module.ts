import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '../passport/passport.module';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { PermissionModule } from '../permission/permission.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    PassportModule,
    PermissionModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
