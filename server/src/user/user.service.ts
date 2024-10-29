import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) { }
    async onModuleInit() {
        await this.initializeAdminUser();
    }

    async initializeAdminUser(): Promise<void> {
        const userCount = await this.userRepository.count();
        if (userCount === 0) {
            const adminUser = new User();
            adminUser.name =this.configService.get<string>('INIT_USER_NAME') ;
            adminUser.passwordHashed = await bcrypt.hash(this.configService.get<string>('INIT_USER_PASSWORD') , 10);
            adminUser.isAdmin = true;
            await this.userRepository.save(adminUser);
        }
    }

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
