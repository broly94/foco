import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { UsersEntity } from '@app/users/entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressUserDto {
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
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  post_code: number;

  @ApiProperty()
  @IsNotEmpty()
  user: UsersEntity | number;
}
