import { Injectable } from '@nestjs/common';
import { PlayList } from './play-list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayListService {
  constructor(
    @InjectRepository(PlayList)
    private readonly playlistRepository: Repository<PlayList>,
  ) { }

  readonly favoriteName = 'Favorite';

  create(playlist: PlayList): Promise<PlayList> {
    return this.playlistRepository.save(playlist);
  }

  update(id: number, playlist: PlayList): Promise<PlayList> {
    return this.playlistRepository.save({ ...playlist, id });
  }

  async delete(id: number): Promise<Boolean> {
    const result = await this.playlistRepository.delete(id);
    return result.affected > 0;
  }

  async findAll(userId: number): Promise<PlayList[]> {
    await this.checkAndCreateFavorite(userId);
    return this.playlistRepository.find(
      {
        where: { user: { id: userId } },
        order: { 
          isSys: 'DESC',
          updatedAt: 'DESC' }
      }
    );
  }

  findOne(id: number): Promise<PlayList> {
    return this.playlistRepository.findOneBy({ id });
  }

  async checkOwner(userId: number, playlistId: number): Promise<Boolean> {
    const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
    return playlist.user.id === userId;
  }

  async checkAndCreateFavorite(userId: number): Promise<PlayList> {
    const favorite = await this.playlistRepository.findOne({
      where: { user: { id: userId }, isSys: true, name: this.favoriteName }
    });
    if (favorite) {
      return favorite;
    } else {
      const newFavorite = new PlayList();
      newFavorite.name = this.favoriteName;
      newFavorite.isSys = true;
      newFavorite.user = { id: userId } as any;
      console.log('newFavorite', newFavorite);
      const re= await this.playlistRepository.save(newFavorite);
      console.log('re', re);
      return re;
    }
  }

  async addMovie(userId:number, playlistId: number, movieId: number): Promise<PlayList> {
    if( await this.checkOwner(userId, playlistId) === false){
      throw new Error('Not the owner of the playlist');
    }
    const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
    playlist.movies.push({ id: movieId } as any);
    return this.playlistRepository.save(playlist);
  }

  async removeMovie(userId:number, playlistId: number, movieId: number): Promise<PlayList> {
    if( await this.checkOwner(userId, playlistId) === false){
      throw new Error('Not the owner of the playlist');
    }
    const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
    playlist.movies = playlist.movies.filter(m => m.id !== movieId);
    return this.playlistRepository.save(playlist);
  }
}