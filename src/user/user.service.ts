import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User | undefined> {
        return this.userRepository.findOneBy({ id });
    }

    async findOneByName(name: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ name });
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
