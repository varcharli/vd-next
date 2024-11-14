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
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(PlayList)
    private readonly playListRepository: Repository<PlayList>,
    @InjectRepository(PlayListItem)
    private readonly playListItemRepository: Repository<PlayListItem>,
    private readonly playListService: PlayListService,
    private readonly actorService: ActorService,
    private readonly galleryService: GalleryService
  ) { }

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
      const reCount = await this.movieRepository.query(
        `select count(*) from movie a 
          inner join movie_actors_actor b on a.id = b."movieId"
          where b."actorId" = $1
        `, [actorId]);
      const count = parseInt(reCount[0].count, 10);
      const re = await this.movieRepository.query(
        `select a.* from movie a 
          inner join movie_actors_actor b on a.id = b."movieId"
          where b."actorId" = $1
          order by a."${field}" ${direction.toUpperCase() as 'ASC' | 'DESC'} NULLS LAST
          limit $2 
          offset $3
        `, [actorId, limit, offset]);
      return [re, count];
    }


    if (playListId) {
      let orderStr = '';
      if (field === 'id') {
        orderStr = 'b."createAt" desc';
      }
      else {
        orderStr = `a."${field}" ${direction.toUpperCase() as 'ASC' | 'DESC'}`;
      }
      const countRe = await this.movieRepository.query(
        `select count(*) from play_list_item a
      inner join play_list b on a."playListId" = b.id and b."userId"=1
      where a."playListId" = $1 ;`, [playListId]);
      const count = parseInt(countRe[0].count, 10);
      if (count === 0) {
        return [[], 0];
      }

      const re = await this.movieRepository.query(
        `select a.* from movie a 
          RIGHT join play_list_item b
            on a.id = b."movieId"
          LEFT JOIN play_list c
            on b."playListId" = c.id and c."userId" = $1
          where c.id = $2 
          order by ${orderStr}
          limit $3 
          offset $4
        `, [userId, playListId, limit, offset]);
      return [re, count];
    }

    const repo = this.movieRepository.createQueryBuilder('movie');
    if (title) {
      repo.where([
        { name: ILike(`%${title}%`) },
        { sn: ILike(`%${title}%`) }
      ]);
    }
    repo.orderBy(`movie."${field}"`, direction.toUpperCase() as 'ASC' | 'DESC');
    repo.skip(offset);
    repo.take(limit);
    const movies = repo.getManyAndCount();

    return movies;
  }



  async findById(id: number, userId: number): Promise<any> {
    const re = await this.movieRepository.findOne({
      where: { id },
      relations: ['actors', 'tags', 'playLinks', 'directors', 'galleries'],
    }) as any;

    const playLists = await this.playListItemRepository.query(
      `select a."playListId" as id,b.name from play_list_item a
        inner join play_list b on a."playListId" = b.id
      where "movieId" = $1 and b."userId" = $2`,
      [id, userId]
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

    // Execute raw SQL query to get currentPlayListIds
    const currentPlayListIdsResult = await this.movieRepository.query(
      `select a."playListId" from play_list_item a 
        inner join movie b on a."movieId" = b.id
        inner join play_list c on a."playListId" = c.id
        where a."movieId" = $1 and c."userId" = $2`,
      [movieId, userId]
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

  async exists(sn: string): Promise<boolean> {
    const re = await this.movieRepository.findOne({
      where: { sn }
    });
    return !!re;
  }

  // create movie and o2m,m2m fields
  async generate(movie: Movie) {
    // if (await this.exists(movie.sn)) {
    //   return null;
    // }

    const actors = [] as Actor[];
    console.log("movie.actors:", movie.actors);
    if (movie.actors) {
      for (const item of movie.actors) {
        console.log("item:", item);
        const re = await this.actorService.findByName(item.name)
        if (re) {
          // item = { id: re.id } as Actor;
          console.log("same one", re.id, re.name);
          actors.push(re);
        } else {
          const newActor = await this.actorService.create({ name: item.name, photoUrl: item.photoUrl } as Actor);
          // item = { id: newActor.id } as Actor;
          console.log("new one", newActor.id, newActor.name);
          actors.push(newActor);
        }
      }
      console.log("actors:", actors);
    }
    const galleries = [] as Gallery[];
    if (movie.galleries) {
      for (const item of movie.galleries) {
        const re = await this.galleryService.findByUrl(item.url);
        if (re) {
          // item = { id: re.id } as Gallery;
          // await this.galleryService.update(re.id, { movie: saved } as Gallery);
          galleries.push(re);
        }
        else {
          const newGallery = await this.galleryService.create({ url: item.url } as Gallery);
          // item = { id: newGallery.id } as Gallery;
          galleries.push(newGallery);
        }
      }
      console.log("movie.galleries:", movie.galleries, galleries);
    }


    const m = new Movie();
    m.sn = movie.sn;
    m.name = movie.name;
    m.releaseDate = movie.releaseDate;
    m.posterUrl = movie.posterUrl;
    m.largePosterUrl = movie.largePosterUrl;
    m.description = movie.description;
    m.fromUrl = movie.fromUrl;
    m.actors = actors;
    m.galleries = galleries;
    console.log("m:", m.actors);
    // m.galleries = galleries;
    const saved = await this.movieRepository.save(m);
    console.log("re", saved);



    return saved;
  }


}