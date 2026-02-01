import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateOrUpdateRatingsMarketingDto {
  @ApiProperty({ maximum: 5, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  starts: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  marketing_strategy: number;
}
