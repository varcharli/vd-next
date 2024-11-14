
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DownloadLinkService } from './download-link.service';
import { DownloadLink } from './download-link.entity';

@Controller('download-links')
export class DownloadLinkController {
  constructor(private readonly downloadLinkService: DownloadLinkService) {}

  @Post()
  create(@Body() downloadLink: DownloadLink): Promise<DownloadLink> {
    return this.downloadLinkService.create(downloadLink);
  }

  @Get()
  findAll(): Promise<DownloadLink[]> {
    return this.downloadLinkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<DownloadLink> {
    return this.downloadLinkService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() downloadLink: DownloadLink): Promise<boolean> {
    return this.downloadLinkService.update(id, downloadLink);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<boolean> {
    return this.downloadLinkService.delete(id);
  }
}