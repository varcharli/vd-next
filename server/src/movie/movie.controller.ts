import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @Post()
  create(@Body() movie: Movie): Promise<Movie> {
    return this.movieService.create(movie);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() movie: Movie): Promise<Movie> {
    return this.movieService.update(id, movie);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    const result = await this.movieService.delete(id);
    return result.affected > 0;
  }


  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('order') order?: string,
    @Query('title') title?: string,
    @Query('playListId') playListId?: number,
  ): Promise<[Movie[], number]> {
    return this.movieService.findAll({ limit, offset, order, title, playListId });
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Movie> {
    return this.movieService.findById(id);
  }
}