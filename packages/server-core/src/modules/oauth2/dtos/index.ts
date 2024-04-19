import { IsString } from 'class-validator';

export class GoogleRedirectDTO {
  @IsString()
  redirectUri!: string;
}

export class GoogleAuthorizeDTO {
  @IsString()
  state!: string;
  @IsString()
  code!: string;
  @IsString()
  redirectUri!: string;
}
