import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ minimum: 10, maximum: 10, type: 'string' })
  @IsString()
  @IsOptional()
  @Length(10, 10)
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tokenForgotPassword: string;
}
