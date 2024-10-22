import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ActorService } from './actor.service';
import { Actor } from '../models/movie.entity';
import { DeleteResult } from 'typeorm';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  create(@Body() actor: Actor): Promise<Actor> {
    return this.actorService.create(actor);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() actor: Actor): Promise<Actor> {
    return this.actorService.update(id, actor);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.actorService.delete(id);
  }

  @Get()
  findAll(): Promise<Actor[]> {
    return this.actorService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Actor> {
    return this.actorService.findById(id);
  }
}