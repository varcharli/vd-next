import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorService } from './director.service';
import { Director } from './director.entity';
import { DirectorController } from './director.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Director])],
    providers: [DirectorService],
    controllers: [DirectorController],
    exports: [DirectorService],
})
export class DirectorModule { }