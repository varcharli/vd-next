import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Actor } from './actor.entity';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) { }

  create(actor: Actor): Promise<Actor> {
    return this.actorRepository.save(actor);
  }

  async update(id: number, actor: Actor): Promise<Actor> {
    await this.actorRepository.update(id, actor);
    return this.actorRepository.findOneBy({ id });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.actorRepository.delete(id);
  }

  async findAll(limit: number, offset: number, order: string, title: string): Promise<[Actor[], number]> {
    const repo = this.actorRepository.createQueryBuilder('actor');
    if (title) {
      repo.where([
        { name: ILike(`%${title}%`) },
      ]);
    }
    // repo.orderBy(`actor."${field}"`, direction.toUpperCase() as 'ASC' | 'DESC');
    repo.skip(offset ?? 0);
    repo.take(limit ?? 12);
    const data =await repo.getManyAndCount();
    return data;

    // return this.actorRepository.findAndCount();
  }

  findById(id: number): Promise<Actor> {
    return this.actorRepository.findOneBy({ id });
  }

  findByName(name: string): Promise<Actor> {
    return this.actorRepository.findOneBy({ name });
  }

  exsits(name: string): Promise<boolean> {
    return this.actorRepository.exists(
      { where: { name } }
    )
  }


}