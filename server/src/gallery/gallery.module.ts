import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryService } from './gallery.service';
import { Gallery } from './gallery.entity';
import { GalleryController } from './gallery.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Gallery])],
    providers: [GalleryService],
    controllers: [GalleryController],
    exports: [GalleryService],
})
export class GalleryModule { }