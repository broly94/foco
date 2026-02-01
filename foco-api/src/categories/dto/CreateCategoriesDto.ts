import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateCategoriesDto {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => [Object] })
  @IsNotEmpty()
  subcategories01: Array<{
    id: number;
    name: string;
    subcategories02: Array<{ id: number; name: string }>;
  }>;
}
