import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Actor } from '../models/movie.entity';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  create(actor: Actor): Promise<Actor> {
    return this.actorRepository.save(actor);
  }

  update(id: number, actor: Actor): Promise<Actor> {
    return this.actorRepository.save({ ...actor, id });
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