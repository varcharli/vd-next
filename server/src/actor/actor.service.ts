import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Actor } from './actor.entity';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  create(actor: Actor): Promise<Actor> {
    return this.actorRepository.save(actor);
  }

  async update(id: number, actor: Actor): Promise<Actor> {
    await this.actorRepository.update(id,actor );
    return this.actorRepository.findOneBy({id});
  }

  delete(id: number): Promise<DeleteResult> {
    return this.actorRepository.delete(id);
  }

  findAll(): Promise<Actor[]> {
    return this.actorRepository.find();
  }

  findById(id: number): Promise<Actor> {
    return this.actorRepository.findOneBy({id});
  }
}