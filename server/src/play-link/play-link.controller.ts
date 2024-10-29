import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlayLinkService } from './play-link.service';
import { PlayLink } from './play-link.entity';

@Controller('play-links')
export class PlayLinkController {
  constructor(private readonly playLinkService: PlayLinkService) {}

  @Post()
  create(@Body() playLink: PlayLink): Promise<PlayLink> {
    return this.playLinkService.create(playLink);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() playLink: PlayLink): Promise<PlayLink> {
    return this.playLinkService.update(id, playLink);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    return this.playLinkService.delete(id);
  }

  @Get()
  findAll(): Promise<PlayLink[]> {
    return this.playLinkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PlayLink> {
    return this.playLinkService.findOne(id);
  }
}