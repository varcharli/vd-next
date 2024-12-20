import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, NotFoundException,Query,Request } from '@nestjs/common';
import { ActorService } from './actor.service';
import { Actor } from './actor.entity';


@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() actor: Actor): Promise<Actor> {
    return this.actorService.create(actor);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() actor: Actor): Promise<Actor> {
    const updatedActor = await this.actorService.update(id, actor);
    if (!updatedActor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }
    return updatedActor;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    const result = await this.actorService.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('order') order?: string,
    @Query('title') title?: string,
  ): Promise<[Actor[],number]> {
    return this.actorService.findAll(limit, offset, order, title);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number): Promise<Actor> {
    const actor = await this.actorService.findById(id);
    if (!actor) {
      throw new NotFoundException(`Actor with ID ${id} not found`);
    }
    return actor;
  }
}