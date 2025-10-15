import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: "User's current password",
    required: true,
  })
  @IsString({ message: 'Old password must be a string' })
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;
  

  @ApiProperty({
    example: 'NewPassword123!',
    description:
      "User's new password — must contain at least one uppercase letter, one number, and be at least 8 characters long",
    required: true,
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/, {
    message:
      'New password must contain at least one uppercase letter, one number, and one special character',
  })
  newPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Must match the new password exactly (used for confirmation)',
    required: true,
  })
  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}
