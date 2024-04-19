import { IsNotEmpty } from 'class-validator';

export class UserRegisterUserName {
  @IsNotEmpty()
  username!: string;
  @IsNotEmpty()
  password!: string;
  @IsNotEmpty()
  response!: string;
}
