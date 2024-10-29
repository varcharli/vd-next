import { Injectable } from '@nestjs/common';
import { PlayList } from './play-list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayListService {
  constructor(
    @InjectRepository(PlayList)
    private readonly playlistRepository: Repository<PlayList>,
  ) {}

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

  findAll(): Promise<PlayList[]> {
    return this.playlistRepository.find();
  }

  findOne(id: number): Promise<PlayList> {
    return this.playlistRepository.findOneBy({ id });
  }
}