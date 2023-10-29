import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'role_policy',
})
export class RolePolicyEntity extends BaseEntity {
  @Column({
    name: 'role_id',
    type: 'int',
  })
  roleId!: number;

  @Column({
    name: 'policy_id',
    type: 'int',
  })
  policyId!: number;
}
