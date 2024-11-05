import { Injectable } from '@nestjs/common';
import { PlayLink } from './play-link.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlayLinkService {
  constructor(
    @InjectRepository(PlayLink)
    private readonly playLinkRepository: Repository<PlayLink>,
  ) {}

  create(playLink: PlayLink): Promise<PlayLink> {
    return this.playLinkRepository.save(playLink);
  }

  async update(id: number, playLink: PlayLink): Promise<boolean> {
    const re= await this.playLinkRepository.update(id, playLink);
    return true;
  }

  async delete(id: number): Promise<Boolean> {
    const result = await this.playLinkRepository.delete(id);
    return result.affected > 0;
  }

  findAll(): Promise<PlayLink[]> {
    return this.playLinkRepository.find();
  }

  findOne(id: number): Promise<PlayLink> {
    return this.playLinkRepository.findOneBy({ id });
  }
}