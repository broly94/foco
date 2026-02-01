import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UsersEntity } from '@app/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lon: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  post_code: number;

  @ApiProperty()
  @IsNotEmpty()
  user: UsersEntity | number;
}
