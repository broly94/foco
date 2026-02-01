import { UserType } from '@app/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class MakeAdminDto {
  @ApiProperty({ enum: UserType })
  @IsNotEmpty()
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
