import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlayListService } from './play-list.service';
import { PlayList } from './play-list.entity';

@Controller('play-lists')
export class PlayListController {
  constructor(private readonly playListService: PlayListService) {}

  @Post()
  create(@Body() playList: PlayList): Promise<PlayList> {
    return this.playListService.create(playList);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() playList: PlayList): Promise<PlayList> {
    return this.playListService.update(id, playList);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    return this.playListService.delete(id);
  }

  @Get()
  findAll(): Promise<PlayList[]> {
    return this.playListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PlayList> {
    return this.playListService.findOne(id);
  }
}