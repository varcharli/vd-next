import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from '../models/movie.entity';
import { DeleteResult } from 'typeorm';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() movie: Movie): Promise<Movie> {
    return this.movieService.create(movie);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() movie: Movie): Promise<Movie> {
    return this.movieService.update(id, movie);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.movieService.delete(id);
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