import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { TagController } from './tag.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    providers: [TagService],
    controllers: [TagController],
    exports: [TagService],
})
export class TagModule { }