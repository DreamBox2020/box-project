import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'google_oauth2',
})
export class GoogleOauth2Entity extends BaseEntity {
  @Column({
    name: 'openid',
    type: 'varchar',
    length: 64,
    unique: true,
  })
  openid!: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 64,
  })
  email!: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
    length: 64,
  })
  name?: string;

  @Column({
    name: 'given_name',
    type: 'varchar',
    nullable: true,
    length: 32,
  })
  givenName?: string;

  @Column({
    name: 'family_name',
    type: 'varchar',
    nullable: true,
    length: 32,
  })
  familyName?: string;

  @Column({
    name: 'picture',
    type: 'varchar',
    nullable: true,
    length: 255,
  })
  picture?: string;

  @Column({
    name: 'locale',
    type: 'varchar',
    nullable: true,
    length: 16,
  })
  locale?: string;
}
