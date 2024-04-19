import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportEntity } from './entities/passport.entity';
import { PassportService } from './passport.service';
import { PassportController } from './passport.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([PassportEntity]), PermissionModule],
  providers: [PassportService],
  controllers: [PassportController],
  exports: [TypeOrmModule, PassportService],
})
export class PassportModule {}
