import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import {
  Movie,
  Actor,
  Director,
  PlayLink,
  PlayList,
  Gallery,
  Tag,
} from './models/movie.entity';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { MovieService } from './movie/movie.service';
import { ActorService } from './actor/actor.service';
import { DirectorService } from './director/director.service';
import { PlayLinkService } from './play-link/play-link.service';
import { PlayListService } from './play-list/play-list.service';
import { GalleryService } from './gallery/gallery.service';
import { TagService } from './tag/tag.service';
import { MovieController } from './movie/movie.controller';
import { ActorController } from './actor/actor.controller';
import { DirectorController } from './director/director.controller';
import { PlayLinkController } from './play-link/play-link.controller';
import { PlayListController } from './play-list/play-list.controller';
import { GalleryController } from './gallery/gallery.controller';
import { TagController } from './tag/tag.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使 ConfigModule 在整个应用程序中全局可用
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User,
          Movie,
          Actor,
          Director,
          PlayLink,
          PlayList,
          Gallery,
          Tag,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Movie,
      Actor,
      Director,
      PlayLink,
      PlayList,
      Gallery,
      Tag,
    ]),
  ],
  controllers: [AppController, UserController, MovieController, ActorController, DirectorController, PlayLinkController, PlayListController, GalleryController, TagController],
  providers: [AppService, UserService, MovieService, ActorService, DirectorService, PlayLinkService, PlayListService, GalleryService, TagService],
})
export class AppModule { }
