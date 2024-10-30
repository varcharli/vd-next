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

    async findById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: {id} ,
            select: ['id', 'name', 'isAdmin']
        });
    }

    // async findOneByName(name: string): Promise<User | undefined> {
    //     return this.userRepository.findOneBy({ name });
    // }

    async checkPasswordByUserName(name: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ name });
        if (user && await bcrypt.compare(password, user.passwordHashed)) {
            return user;
        }
        return null;
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
    async checkPassword(id:number, password: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({id});
        if (user && await bcrypt.compare(password, user.passwordHashed)) {
            return user;
        }
        return null;
    }

    async changePassword(id: number, newPassword: string): Promise<User> {
        const user = await this.userRepository.findOneBy ({id});
        if (user) {
            user.passwordHashed = await bcrypt.hash(newPassword, 10);
            await this.userRepository.update(id, { passwordHashed: user.passwordHashed });
            return user;
        }
        return null;
    }
}
