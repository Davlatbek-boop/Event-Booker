import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles-auth.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserSelfGuard } from '../common/guards/user-self.guard';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create new booking (user only)' })
  @ApiResponse({ status: 201, description: 'Booking successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid booking data' })
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Roles('admin', 'creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all bookings (admin or creator)' })
  @ApiResponse({ status: 200, description: 'List of all bookings returned' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admin/creator allowed',
  })
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Roles('admin', 'creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get booking by ID (admin or creator)' })
  @ApiResponse({ status: 200, description: 'Booking found and returned' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Get('byuser/:id')
  @UseGuards(AuthGuard, UserSelfGuard)
  @ApiOperation({ summary: 'Get bookings by user ID (user only)' })
  @ApiResponse({ status: 200, description: 'Bookings found and returned' })
  @ApiResponse({ status: 404, description: 'No bookings found for this user' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  findByUserId(@Param('id') id: string) {
    return this.bookingsService.findByUserId(+id);
  }

  @Roles('admin', 'creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update booking by ID (admin or creator)' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Roles('admin', 'creator')
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking by ID (admin or creator)' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', description: 'Booking ID', example: 1 })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
