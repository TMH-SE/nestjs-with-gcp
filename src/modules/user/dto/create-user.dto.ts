import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'test.user@gmail.com',
  })
  @Expose()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: '+84326123456',
  })
  @Expose()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    default: 'Test',
  })
  @Expose()
  @MinLength(1)
  lastName: string;

  @ApiProperty({
    default: 'User',
  })
  @Expose()
  @MinLength(1)
  firstName: string;

  @ApiPropertyOptional({
    default: '2022-01-01',
  })
  @Expose()
  @IsDateString()
  birthDay: string;
}
