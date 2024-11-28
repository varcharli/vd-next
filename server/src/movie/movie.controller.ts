import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('movies')

export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() movie: Movie): Promise<Movie> {
    return this.movieService.create(movie);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() movie: Movie): Promise<Movie> {
    return this.movieService.update(id, movie);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    const result = await this.movieService.delete(id);
    return result.affected > 0;
  }


  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('order') order?: string,
    @Query('title') title?: string,
    @Query('playListId') playListId?: number,
    @Query('actorId') actorId?: number,
  ): Promise<[Movie[], number]> {
    const userId = req.user.userId;
    return this.movieService.findAll({ limit, offset, order, title, playListId, actorId, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Request() req,@Param('id') id: number): Promise<Movie> {
    const userId = req.user.userId;
    return this.movieService.findById(id,userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/play-lists')
  setPlayLists(@Request() req,@Param('id') id: number, @Body('playListIds') playListIds: number[]): Promise<boolean> {
    const userId = req.user.userId;
    return this.movieService.setPlayLists(id, playListIds, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/actors')
  setActors(@Param('id') id: number, @Body('actorIds') actorIds: number[]): Promise<boolean> {
    return this.movieService.setActors(id, actorIds);
  }


}