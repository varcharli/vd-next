import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.entity';
import { DeleteResult } from 'typeorm';

@Controller('movies')
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
  findAll(): Promise<Movie[]> {
    return this.movieService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<Movie> {
    return this.movieService.findById(id);
  }
}