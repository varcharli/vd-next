import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { Movie } from './movie.entity';
import { Gallery } from '../gallery/gallery.entity';
import { PlayList } from 'src/play-list/play-list.entity';


interface FindAllParams {
  limit?: number;
  offset?: number;
  order?: string;
  title?: string;
  playListId?: number;
}

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(PlayList)
    private readonly playListRepository: Repository<PlayList>,
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
      title,
      playListId,
    }: FindAllParams
  ): Promise<[Movie[], number]> {
    const [field, direction] = (order).split(' ');


    const queryBuilder: SelectQueryBuilder<Movie> = this.movieRepository.createQueryBuilder('movie');


    // playListId and title cannot be used together
    if (playListId) {
      queryBuilder.leftJoinAndSelect('movie.playLists', 'play-list')
        .where('play-list.id = :playListId', { playListId });
    } else {
      if (title) {
        queryBuilder.where([
          { name: ILike(`%${title}%`) },
          { sn: ILike(`%${title}%`) }
        ]);
      }
    }

    queryBuilder
    .take(limit)
    .skip(offset)
    .orderBy(`movie.${field}`, direction.toUpperCase() as 'ASC' | 'DESC', 'NULLS LAST');
    // console.log('queryBuilder.getManyAndCount()---------', queryBuilder.getSql());

    const query = queryBuilder.getManyAndCount();
    return query;

    // const query: any = {
    //   take: limit,
    //   skip: offset,
    //   order: {
    //     [field]: direction.toUpperCase() as 'ASC' | 'DESC'
    //   }
    // };

    // if (title) {
    //   query.where = [
    //     { name: ILike(`%${title}%`) },
    //     { sn: ILike(`%${title}%`) }
    //   ];
    // }

    // return this.movieRepository.findAndCount(query);
  }

  findById(id: number): Promise<Movie> {
    return this.movieRepository.findOne({
      where: { id },
      relations: ['actors', 'tags', 'playLinks', 'directors', 'playLists', 'galleries'],
    });
  }

  async setPlayLists(id: number, playListIds: number[]): Promise<boolean> {
    const movie = await this.movieRepository.findOne({ where: { id }, relations: ['playLists'] });
    if (!movie) {
      throw new Error('Movie not found');
    }

    const playLists = await this.playListRepository.findByIds(playListIds);
    movie.playLists = playLists;
    console.log('playListIds-----', playListIds);
    console.log('movie.playLists-----', movie.playLists);
    await this.movieRepository.save(movie);
    return true;
  }
}