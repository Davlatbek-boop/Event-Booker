import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    description: 'Title of the event (e.g. concert, seminar, or movie name)',
    example: 'Node.js Workshop 2025',
  })
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title should not be empty' })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the event (purpose, location, etc.)',
    example:
      'An advanced hands-on workshop for backend developers using NestJS.',
  })
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description should not be empty' })
  description: string;

  @ApiProperty({
    description: 'Total number of seats available for this event',
    example: 100,
    minimum: 1,
  })
  @IsInt({ message: 'total_seats must be an integer' })
  @Min(1, { message: 'total_seats must be at least 1' })
  total_seats: number;

  @ApiProperty({
    description: 'Date and time when the event will take place',
    example: '2025-12-15T10:00:00Z',
  })
  @IsNotEmpty({ message: 'date should not be empty' })
  date: Date;
}
