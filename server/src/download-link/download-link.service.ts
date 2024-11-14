import { Injectable } from '@nestjs/common';
import { DownloadLink } from './download-link.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DownloadLinkService {
  constructor(
    @InjectRepository(DownloadLink)
    private readonly downloadLinkRepository: Repository<DownloadLink>,
  ) {}

  create(downloadLink: DownloadLink): Promise<DownloadLink> {
    return this.downloadLinkRepository.save(downloadLink);
  }

  async update(id: number, downloadLink: DownloadLink): Promise<boolean> {
    const result = await this.downloadLinkRepository.update(id, downloadLink);
    return result.affected > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.downloadLinkRepository.delete(id);
    return result.affected > 0;
  }

  findAll(): Promise<DownloadLink[]> {
    return this.downloadLinkRepository.find();
  }

  findOne(id: number): Promise<DownloadLink> {
    return this.downloadLinkRepository.findOneBy({ id });
  }
}