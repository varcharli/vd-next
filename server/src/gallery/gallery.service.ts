import { Injectable } from '@nestjs/common';
import { Gallery } from './gallery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
  ) { }

  create(gallery: Gallery): Promise<Gallery> {
    return this.galleryRepository.save(gallery);
  }

  async update(id: number, gallery: Gallery): Promise<Gallery> {
    const re = await this.galleryRepository.update(id, gallery);
    return await this.galleryRepository.findOneBy({id});
  }

  async delete(id: number): Promise<Boolean> {
    const result = await this.galleryRepository.delete(id);
    return result.affected > 0;
  }

  findAll(): Promise<Gallery[]> {
    return this.galleryRepository.find();
  }

  findOne(id: number): Promise<Gallery> {
    return this.galleryRepository.findOneBy({ id });
  }

  findByUrl(url: string): Promise<Gallery> {
    return this.galleryRepository.findOneBy({ url });
  }

}