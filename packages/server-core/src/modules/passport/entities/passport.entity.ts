import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'passport',
})
export class PassportEntity extends BaseEntity {
  @Column({
    name: 'token',
    type: 'varchar',
    length: 64,
  })
  token!: string;

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: true,
  })
  userId?: number;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  ipAddress?: string;

  @Column({
    name: 'user_agent',
    type: 'text',
    nullable: true,
  })
  userAgent?: string;

  @Column({
    name: 'client_identifier',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  clientIdentifier?: string;
}
