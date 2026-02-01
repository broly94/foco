import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passwordOne: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passwordTwo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenForgotPassword: string;
}
