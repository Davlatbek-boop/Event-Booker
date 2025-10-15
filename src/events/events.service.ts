import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
  ) {}
  create(createEventDto: CreateEventDto) {
    return this.eventRepo.save(createEventDto);
  }

  findAll() {
    return this.eventRepo.find();
  }

  findOne(id: number) {
    return this.eventRepo.findOneBy({ id });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepo.preload({ id, ...updateEventDto });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.eventRepo.save(event);
  }

  remove(id: number) {
    return this.eventRepo.delete(id);
  }
}
