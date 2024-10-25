import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Gallery } from '../models/movie.entity';

@Controller('galleries')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  create(@Body() gallery: Gallery): Promise<Gallery> {
    return this.galleryService.create(gallery);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() gallery: Gallery): Promise<Gallery> {
    return this.galleryService.update(id, gallery);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    return this.galleryService.delete(id);
  }

  @Get()
  findAll(): Promise<Gallery[]> {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Gallery> {
    return this.galleryService.findOne(id);
  }
}