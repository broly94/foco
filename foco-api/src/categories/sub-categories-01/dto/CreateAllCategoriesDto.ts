import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAllSubCategoriesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  category: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sub_categories_01: string;

  @ApiProperty()
  sub_categories_02: string;
}
