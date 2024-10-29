import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayListService } from './play-list.service';
import { PlayList } from './play-list.entity';
import { PlayListController } from './play-list.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PlayList])],
    providers: [PlayListService],
    controllers: [PlayListController],
    exports: [PlayListService],
})
export class PlayListModule { }