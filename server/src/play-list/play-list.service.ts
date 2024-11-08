import { Injectable } from '@nestjs/common';
import { PlayList, PlayListItem } from './play-list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayListService {
  constructor(
    @InjectRepository(PlayList)
    private readonly playlistRepository: Repository<PlayList>,
    @InjectRepository(PlayListItem)
    private readonly playlistItemRepository: Repository<PlayListItem>
  ) { }

  readonly favoriteName = 'Favorite';

  create(playlist: PlayList): Promise<PlayList> {
    return this.playlistRepository.save(playlist);
  }

  async update(id: number, playlist: PlayList): Promise<any> {
    return this.playlistRepository.update(id, playlist);
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

  findById(id: number): Promise<PlayList> {
    return this.playlistRepository.findOne({
      where: { id },
      relations: ['items'],
     });
  }

  async checkOwner(userId: number, playlistId: number): Promise<Boolean> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId ,user: { id: userId }},
      select: ['id'],
    }
    );
    if(!playlist){
      return false;
    }
    return true;
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
      const re= await this.playlistRepository.save(newFavorite);
      return re;
    }
  }

  // 还没有验证的危险操作
  async addMovie(userId:number, playlistId: number, movieId: number): Promise<PlayListItem> {
    if( await this.checkOwner(userId, playlistId) === false){
      throw new Error('Not the owner of the playlist');
    }
    const chkItem = await this.playlistItemRepository.findOne({
      where: { playList: { id: playlistId }, movie: { id: movieId } }
    });
    if (chkItem) {
      return chkItem;
    }
    const item = new PlayListItem();
    item.playList = { id: playlistId } as any;
    item.movie = { id: movieId } as any;
    item.createAt = new Date();
    return this.playlistItemRepository.save(item);
  }
  
  // 还没有验证的危险操作
  async removeMovie(userId:number, playlistId: number, movieId: number): Promise<boolean> {
    if( await this.checkOwner(userId, playlistId) === false){
      throw new Error('Not the owner of the playlist');
    }
    // const playlist = await this.playlistRepository.findOneBy({ id: playlistId });
    // playlist.movies = playlist.movies.filter(m => m.id !== movieId);
    // return this.playlistRepository.save(playlist);
    const item = await this.playlistItemRepository.findOne({
      where: { playList: { id: playlistId }, movie: { id: movieId } }
    });
    if (item) {
      await this.playlistItemRepository.delete(item.id);
      return true;
    }
    return false;
  }
}