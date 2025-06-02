import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAuthRegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  @MinLength(7)
  password: string;
}

export class CreateAuthLoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
