import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DayOfWeek } from '@app/opening_days_hours/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateOpeningDaysHoursDto {
  @ApiProperty()
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  day: DayOfWeek;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  closes_at_noon: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  open_24_hours: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Invalid time format. Use HH:mm' })
  opening_morning: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Invalid time format. Use HH:mm' })
  opening_afternoon: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Invalid time format. Use HH:mm' })
  closing_morning: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'Invalid time format. Use HH:mm' })
  closing_evening: string;
}
