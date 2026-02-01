import { IsString, IsOptional } from 'class-validator';

export class SocialMediaDto {
  @IsString()
  @IsOptional()
  facebook?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  tiktok?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  free_market?: string;
}
