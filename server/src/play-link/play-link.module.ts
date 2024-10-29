import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayLinkService } from './play-link.service';
import { PlayLink } from './play-link.entity';
import { PlayLinkController } from './play-link.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PlayLink])],
    providers: [PlayLinkService],
    controllers: [PlayLinkController],
    exports: [PlayLinkService],
})
export class PlayLinkModule { }