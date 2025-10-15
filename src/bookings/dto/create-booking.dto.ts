import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateBookingDto {
  @ApiProperty({
    description: "Unique identifier of the user who is making the booking",
    example: 12,
  })
  @IsInt({ message: "user_id must be an integer" })
  @IsNotEmpty({ message: "user_id should not be empty" })
  @Min(1, { message: "user_id must be at least 1" })
  userId: number;

  @ApiProperty({
    description: "Unique identifier of the event being booked",
    example: 5,
  })
  @IsInt({ message: "event_id must be an integer" })
  @IsNotEmpty({ message: "event_id should not be empty" })
  @Min(1, { message: "event_id must be at least 1" })
  eventId: number;
}
