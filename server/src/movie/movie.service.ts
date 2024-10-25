import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Movie,Gallery } from '../models/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) {}

  create(movie: Movie): Promise<Movie> {
    const newMovie = this.movieRepository.create(movie);
    return this.movieRepository.save(newMovie);
  }

  update(id: number, movie: Movie): Promise<Movie> {
    return this.movieRepository.save({ ...movie, id });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.movieRepository.delete(id);
  }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  findById(id: number): Promise<Movie> {
    return this.movieRepository.findOneBy({id});
  }
}