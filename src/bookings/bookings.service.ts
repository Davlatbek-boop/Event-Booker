import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { error } from 'console';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly eventRepo: EventsService,
    private readonly userRepo: UsersService,
    private readonly mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const event = await this.eventRepo.findOne(createBookingDto.eventId);
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createBookingDto.eventId} not found`,
      );
    }

    const user = await this.userRepo.findOne(createBookingDto.userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createBookingDto.userId} not found`,
      );
    }

    const booking = await this.bookingRepo.findOneBy({
      user_id: createBookingDto.userId,
    });

    if (booking?.event_id == createBookingDto.eventId) {
      throw new NotFoundException(`You have already booked an event`);
    }

    await this.eventRepo.update(event.id, {
      total_seats: event.total_seats - 1,
    });

    const info = {
      event: event.title,
      description: event.description,
      date: event.date,
    };

    try {
      await this.mailService.sendMailNewEvent(info, user.email);
    } catch (error) {
      console.log(error);
    }

    return this.bookingRepo.save({
      user_id: createBookingDto.userId,
      event_id: createBookingDto.eventId,
      event: { id: createBookingDto.eventId },
      user: { id: createBookingDto.userId },
    });
  }

  findAll() {
    return this.bookingRepo.find();
  }

  findOne(id: number) {
    return this.bookingRepo.findOneBy({ id });
  }

  findByUserId(id: number) {
    return this.bookingRepo.find({
      where: { user_id: id },
      relations: ['event'],
    });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const event = await this.eventRepo.findOne(updateBookingDto.eventId!);
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${updateBookingDto.eventId} not found`,
      );
    }

    const user = await this.userRepo.findOne(updateBookingDto.userId!);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${updateBookingDto.userId} not found`,
      );
    }
    const booking = await this.bookingRepo.preload({
      id,
      user_id: updateBookingDto.userId,
      event_id: updateBookingDto.eventId,
      user: { id: updateBookingDto.userId },
      event: { id: updateBookingDto.eventId },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return this.bookingRepo.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    const event = await this.eventRepo.findOne(booking?.event_id);
    if (!event) {
      throw new NotFoundException(`Event with Id ${id} not found`);
    }
    await this.eventRepo.update(event?.id, {
      total_seats: event?.total_seats + 1,
    });
    return this.bookingRepo.delete(id);
  }
}
