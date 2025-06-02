import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  avatarUrl?: string;

  @Expose()
  @IsString()
  @IsOptional()
  resume?: string;

  @Expose()
  @IsString()
  @IsOptional()
  bio?: string;

  // this will be used to detect role change attemts
  @Expose()
  @IsString()
  @IsOptional()
  role?: string;
}
