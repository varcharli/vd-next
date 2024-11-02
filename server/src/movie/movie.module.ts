// src/movie/movie.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { MovieController } from './movie.controller';
import { PlayList,PlayListItem } from 'src/play-list/play-list.entity';
import { PlayListService } from 'src/play-list/play-list.service';

@Module({
    imports: [TypeOrmModule.forFeature([Movie,PlayList,PlayListItem])],
    providers: [MovieService,PlayListService],
    controllers: [MovieController],
    exports: [MovieService],
})

export class MovieModule { }