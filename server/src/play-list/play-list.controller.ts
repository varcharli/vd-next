import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards,Request } from '@nestjs/common';
import { PlayListService } from './play-list.service';
import { PlayList, PlayListItem } from './play-list.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('play-lists')
export class PlayListController {
  constructor(private readonly playListService: PlayListService) {}

  @Post()
  create(@Request() req, @Body() playList: PlayList): Promise<PlayList> {
    const user= new User();
    user.id = req.user.userId;
    playList.user = user;
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
  findAll(@Request() req): Promise<PlayList[]> {
    const userId = req.user.userId;
    return this.playListService.findAll(userId);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<PlayList> {
    return this.playListService.findById(id);
  }

  @Post(':id/movie/:movieId')
  addMovie(@Request() req, @Param('id') id: number, @Param('movieId') movieId: number): Promise<PlayListItem> {
    const userId = req.user.userId;
    return this.playListService.addMovie(userId, id, movieId);
  }

  @Delete(':id/movie/:movieId')
  removeMovie(@Request() req, @Param('id') id: number, @Param('movieId') movieId: number): Promise<boolean> {
    const userId = req.user.userId;
    return this.playListService.removeMovie(userId, id, movieId);
  }
}