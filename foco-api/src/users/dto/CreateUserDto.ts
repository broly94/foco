import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from '@app/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  googleId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  token_access_google: string;

  @ApiProperty({ minimum: 9, maximum: 15, type: 'string' })
  @IsString()
  @Length(9, 15)
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  numberOfStrategy: number;

  @ApiProperty({ enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
