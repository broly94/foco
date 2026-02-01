import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MarketingStrategyEntity } from '@app/marketing_strategy/entities/marketing_strategy.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressMarketingStrategyDto {
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
  town: string;

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
  marketing_strategy: MarketingStrategyEntity | number;
}
