import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { PolicyEntity } from './entities/policy.entity';
import { UserRoleEntity } from './entities/user-role.entity';
import { RolePolicyEntity } from './entities/role-policy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PolicyEntity,
      UserRoleEntity,
      RolePolicyEntity,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [TypeOrmModule],
})
export class PermissionModule {}
