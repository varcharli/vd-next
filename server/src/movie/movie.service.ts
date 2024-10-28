import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Movie, Gallery } from '../models/movie.entity';


interface FindAllParams {
  limit?: number;
  offset?: number;
  order?: string;
  title?: string;
}

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) { }

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

  findAll(
    { limit = 30,
      offset = 0,
      order = 'id DESC',
      title }: FindAllParams
  ): Promise<[Movie[],number]> {
    const [field, direction] = (order).split(' ');

    const query: any = {
      take: limit,
      skip: offset,
      order: {
        [field]: direction.toUpperCase() as 'ASC' | 'DESC'
      }
    };

    if (title) {
      query.where = [
        { name: ILike(`%${title}%`) },
        { sn: ILike(`%${title}%`) }
      ];
    }

    return this.movieRepository.findAndCount(query);
  }

  findById(id: number): Promise<Movie> {
    return this.movieRepository.findOne({
      where: { id },
      relations: ['actors', 'tags', 'playLinks', 'directors', 'playLists', 'galleries'],
    });
  }
}