import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportEntity } from './entities/passport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PassportEntity])],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class PassportModule {}
