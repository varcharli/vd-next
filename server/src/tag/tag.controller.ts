import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() tag: Tag): Promise<Tag> {
    return this.tagService.create(tag);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() tag: Tag): Promise<Tag> {
    return this.tagService.update(id, tag);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    return this.tagService.delete(id);
  }

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Tag> {
    return this.tagService.findOne(id);
  }
}