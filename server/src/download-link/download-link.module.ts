import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadLinkService } from './download-link.service';
import { DownloadLink } from './download-link.entity';
import { DownloadLinkController } from './download-link.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DownloadLink])],
  providers: [DownloadLinkService],
  controllers: [DownloadLinkController],
  exports: [DownloadLinkService],
})

export class DownloadLinkModule {}