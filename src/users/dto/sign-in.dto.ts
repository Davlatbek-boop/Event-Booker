import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User email address used for login authentication.',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description:
      'User password. Must be at least 8 characters long and was securely hashed on the server.',
    example: 'StrongP@ssw0rd',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;
} 
