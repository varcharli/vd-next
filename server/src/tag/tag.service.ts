import { Injectable } from '@nestjs/common';
import { Tag } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  create(tag: Tag): Promise<Tag> {
    return this.tagRepository.save(tag);
  }

  update(id: number, tag: Tag): Promise<Tag> {
    return this.tagRepository.save({ ...tag, id });
  }

  async delete(id: number): Promise<Boolean> {
    const result = await this.tagRepository.delete(id);
    return result.affected > 0;
  }

  findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  findOne(id: number): Promise<Tag> {
    return this.tagRepository.findOneBy({ id });
  }
}