import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'user_role',
})
export class UserRoleEntity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId!: number;

  @Column({
    name: 'role_id',
    type: 'int',
  })
  roleId!: number;
}
