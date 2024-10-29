// src/movie/movie.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { MovieController } from './movie.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Movie])],
    providers: [MovieService],
    controllers: [MovieController],
    exports: [MovieService],
})

export class MovieModule { }