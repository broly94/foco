import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { AddressMarketingEntity } from '@app/address_marketing/entities/address_marketing.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CategoriesEntity } from '@app/categories/entities/categories.entity';
import { SubCategories01Entity } from '@app/categories/sub-categories-01/entities/sub-categories-01.entity';
import { SubCategories02Entity } from '@app/categories/sub-categories-02/entities/sub-categories-02.entity';
import { SocialMediaDto } from './social_media.dto';
import { Type } from 'class-transformer';

export class CreateMarketingStrategyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Todos los elementos del array deben ser strings' })
  keywords?: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  keyword_ids: number[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  user_phone: boolean;

  @IsInt()
  category_id: number;

  @IsInt()
  sub_category_01_id: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Max(5, { each: true }) // Máximo 5 subcategorías
  @Type(() => Number)
  sub_categories_02_ids?: number[];

  @ApiProperty()
  @IsNotEmpty()
  address_marketing: AddressMarketingEntity;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  @IsObject()
  @IsOptional()
  social_media: SocialMediaDto;
}
