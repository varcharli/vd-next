import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, SelectQueryBuilder, In } from 'typeorm';
import { Movie } from './movie.entity';
import { Gallery } from '../gallery/gallery.entity';
import { GalleryService } from 'src/gallery/gallery.service';
import { PlayList, PlayListItem } from 'src/play-list/play-list.entity';
import { PlayListService } from 'src/play-list/play-list.service';
import { Actor } from 'src/actor/actor.entity';
import { ActorService } from 'src/actor/actor.service';
import { DownloadLink } from '@/download-link/download-link.entity';
import { DownloadLinkService } from '@/download-link/download-link.service';
import { saveOneMovie, getUnfinishedMovies, saveMovieIndexs } from '../scraper/movieScraper';
import * as dotenv from 'dotenv';
dotenv.config();

interface FindAllParams {
  limit?: number;
  offset?: number;
  order?: string;
  title?: string;
  playListId?: number;
  actorId?: number;
  userId?: number;
}

@Injectable()
export class MovieService {
  private dbType: string;
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(PlayList)
    private readonly playListRepository: Repository<PlayList>,
    @InjectRepository(PlayListItem)
    private readonly playListItemRepository: Repository<PlayListItem>,
    @InjectRepository(DownloadLink)
    private readonly downloadLinkRepository: Repository<DownloadLink>,
    private readonly downloadLinkService: DownloadLinkService,

    private readonly playListService: PlayListService,
    private readonly actorService: ActorService,
    private readonly galleryService: GalleryService,

  ) { this.dbType = process.env.DB_TYPE; }

  create(movie: Movie): Promise<Movie> {
    const newMovie = this.movieRepository.create(movie);
    return this.movieRepository.save(newMovie);
  }

  async update(id: number, movie: Movie): Promise<Movie> {
    await this.movieRepository.update(id, movie);
    return this.movieRepository.findOneBy({ id });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.movieRepository.delete(id);
  }

  async findAll(
    { limit = 30,
      offset = 0,
      order = 'id DESC',
      title,
      playListId,
      actorId,
      userId
    }: FindAllParams
  ): Promise<[Movie[], number]> {
    const [field, direction] = (order).split(' ');
    if (actorId) {
      let sql;
      switch (this.dbType) {
        case 'mysql':
          sql = `select count(*) from movie a 
          inner join movie_actors_actor b on a.id = b.movieId
          where b.actorId = ?`;
          break;
        case 'postgres':
          sql = `select count(*) from movie a 
          inner join movie_actors_actor b on a.id = b."movieId"
          where b."actorId" = $1`;
          break;
        default:
          throw new Error('Unknown db type');
      }
      const reCount = await this.movieRepository.query(
        sql, [actorId]);
      const count = parseInt(reCount[0].count, 10);


      switch (this.dbType) {
        case 'mysql':
          sql = `select a.* from movie a 
          inner join movie_actors_actor b on a.id = b.movieId
          where b.actorId = ?
          order by a.${field} ${direction.toUpperCase()} 
          limit ? offset ?`;
          break;
        case 'postgres':
          sql = `select a.* from movie a 
          inner join movie_actors_actor b on a.id = b."movieId"
          where b."actorId" = $1
          order by a."${field}" ${direction.toUpperCase()} NULLS LAST
          limit $2 offset $3`;
          break;
        default:
          throw new Error('Unknown db type');
      }


      const re = await this.movieRepository.query(
        sql, [actorId, Number(limit), Number(offset)]);
      return [re, count];
    }


    if (playListId) {
      let orderStr = '';
      if (field === 'id') {
        switch (this.dbType) {
          case 'mysql':
            orderStr = 'b.createAt desc';
            break;
          case 'postgres':
            orderStr = 'b."createAt" desc';
            break;
          default:
            throw new Error('Unknown db type');
        }
        // orderStr = 'b."createAt" desc';
      }
      else {
        switch (this.dbType) {
          case 'mysql':
            orderStr = `a.${field} ${direction.toUpperCase()}`;
            break;
          case 'postgres':
            orderStr = `a."${field}" ${direction.toUpperCase() as 'ASC' | 'DESC'}`;
            break;
          default:
            throw new Error('Unknown db type');
        }
        // orderStr = `a."${field}" ${direction.toUpperCase() as 'ASC' | 'DESC'}`;
      }

      let sql = '';
      switch (this.dbType) {
        case 'mysql':
          sql = `select count(*) from play_list_item a
          inner join play_list b on a.playListId = b.id and b.userId = ?
          where a.playListId = ?`;
          break;
        case 'postgres':
          sql = `select count(*) from play_list_item a
          inner join play_list b on a."playListId" = b.id and b."userId" = $1
          where a."playListId" = $2`;
          break;
        default:
          throw new Error('Unknown db type');
      }

      const countRe = await this.movieRepository.query(
        sql, [userId, playListId]);
      const count = parseInt(countRe[0].count, 10);
      if (count === 0) {
        return [[], 0];
      }

      switch (this.dbType) {
        case 'mysql':
          sql = `select a.* from movie a 
          RIGHT join play_list_item b
            on a.id = b.movieId
          LEFT JOIN play_list c
            on b.playListId = c.id and c.userId = ?
          where c.id = ?
          order by ${orderStr}
          limit ? offset ?`;
          break;
        case 'postgres':
          sql = `select a.* from movie a 
          RIGHT join play_list_item b
            on a.id = b."movieId"
          LEFT JOIN play_list c
            on b."playListId" = c.id and c."userId" = $1
          where c.id = $2 
          order by ${orderStr}
          limit $3 
          offset $4`;
          break;
        default:
          throw new Error('Unknown db type');
      }

      const re = await this.movieRepository.query(
        sql, [userId, playListId, limit, offset]);
      return [re, count];
    }

    const repo = this.movieRepository.createQueryBuilder('movie');
    if (title) {
      repo.where([
        { name: ILike(`%${title}%`) },
        { sn: ILike(`%${title}%`) }
      ]);
    }
    switch (this.dbType) {
      case 'mysql':
        repo.orderBy(`movie.${field}`, direction.toUpperCase() as 'ASC' | 'DESC');
        break;
      case 'postgres':
        repo.orderBy(`movie."${field}"`, direction.toUpperCase() as 'ASC' | 'DESC');
        break;
      default:
        throw new Error('Unknown db type');
    }
    // repo.orderBy(`movie."${field}"`, direction.toUpperCase() as 'ASC' | 'DESC');
    repo.skip(offset);
    repo.take(limit);
    const movies = repo.getManyAndCount();

    return movies;
  }



  async findById(id: number, userId: number): Promise<any> {
    const re = await this.movieRepository.findOne({
      where: { id },
      relations: ['actors', 'playLinks', 'directors', 'galleries', 'downloadLinks'],
    }) as any;

    let sql = '';
    switch (this.dbType) {
      case 'mysql':
        sql = `select a.* from play_list_item a
        inner join play_list b on a.playListId = b.id
        where a.movieId = ? and b.userId = ?`;
        break;
      case 'postgres':
        sql = `select a.* from play_list_item a
        inner join play_list b on a."playListId" = b.id
        where a."movieId" = $1 and b."userId" = $2`;
        break;
      default:
        throw new Error('Unknown db type');
    }


    const playLists = await this.playListItemRepository.query(
      sql, [id, userId]
    )

    // const playLists = await this.playListRepository.findByIds(playListIds);
    // const playLists=await this.playListRepository.findBy({id:In(playListIds)});
    re.playLists = playLists;

    return re;
  }

  async setPlayLists(id: number, playListIds: number[], userId: number): Promise<boolean> {
    const movieId = id;
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new Error('Movie not found');
    }

    let sql = '';
    switch (this.dbType) {
      case 'mysql':
        sql = `select a.playListId from play_list_item a 
        inner join movie b on a.movieId = b.id
        inner join play_list c on a.playListId = c.id
        where a.movieId = ? and c.userId = ?`;
        break;
      case 'postgres':
        sql = `select a."playListId" from play_list_item a 
        inner join movie b on a."movieId" = b.id
        inner join play_list c on a."playListId" = c.id
        where a."movieId" = $1 and c."userId" = $2`;
        break;
      default:
        throw new Error('Unknown db type');
    }

    // Execute raw SQL query to get currentPlayListIds
    const currentPlayListIdsResult = await this.movieRepository.query(
      sql, [movieId, userId]
    );

    const currentPlayListIds = currentPlayListIdsResult.map(row => parseInt(row.playListId, 10)) as number[];

    const playListsToAdd = playListIds.filter(playListId => !currentPlayListIds.includes(playListId));
    const playListsToRemove = currentPlayListIds.filter(playListId => !playListIds.includes(playListId));

    // Add new playLists
    for (const playListId of playListsToAdd) {
      await this.playListService.addMovie(userId, playListId, movieId);
    }

    // Remove old playLists
    for (const playListId of playListsToRemove) {
      await this.playListService.removeMovie(userId, playListId, movieId);
    }
    return true;
  }

  async setActors(id: number, actorIds: number[]): Promise<boolean> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { actors: true }
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    // remove id if not unique in actorIds.
    const uniqueActorIds = [...new Set(actorIds)];
    const actors = actorIds.map(id => ({ id } as Actor));
    movie.actors = actors;
    try {
      await this.movieRepository.save(movie);
      return true;
    }
    catch (e) {
      console.log('setActors error:', e);
      return false;
    }

  }

  async exists(sn: string): Promise<boolean> {
    const re = await this.movieRepository.findOne({
      where: { sn }
    });
    return !!re;
  }



}