import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'john_doe',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'username must be a string' })
  @MinLength(3, { message: 'username must be at least 3 characters' })
  @MaxLength(30, { message: 'username must not exceed 30 characters' })
  user_name: string;

  @ApiProperty({
    description: 'User email address (used for login and notifications)',
    example: 'john@example.com',
  })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @ApiProperty({
    description:
      'Password (minimum 8 characters, at least one uppercase letter and one number). Stored hashed on the server.',
    example: 'StrongP@ssw0rd',
    minLength: 8,
  })
  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/(?=.*[A-Z])(?=.*\d).+/, {
    message:
      'password must contain at least one uppercase letter and one number',
  })
  password: string;

  @ApiProperty({
    description: 'Role assigned to the user (admin, user, or creator)',
    example: 'user',
  })
  @IsString({ message: 'role must be a string' })
  role?: string;
}
