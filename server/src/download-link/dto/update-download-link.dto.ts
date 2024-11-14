import { PartialType } from '@nestjs/mapped-types';
import { CreateDownloadLinkDto } from './create-download-link.dto';

export class UpdateDownloadLinkDto extends PartialType(CreateDownloadLinkDto) {}
