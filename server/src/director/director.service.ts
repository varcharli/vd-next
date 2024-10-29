import { Injectable } from '@nestjs/common';
import { Director } from './director.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  create(director: Director): Promise<Director> {
    return this.directorRepository.save(director);
  }

  update(id: number, director: Director): Promise<Director> {
    return this.directorRepository.save({ ...director, id });
  }

  async delete(id: number): Promise<Boolean> {
    const result = await this.directorRepository.delete(id);
    return result.affected > 0;
  }

  findAll(): Promise<Director[]> {
    return this.directorRepository.find();
  }

  findOne(id: number): Promise<Director> {
    return this.directorRepository.findOneBy({ id });
  }
}