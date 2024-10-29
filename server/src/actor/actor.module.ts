import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorService } from './actor.service';
import { Actor } from './actor.entity';
import { ActorController } from './actor.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Actor])],
    providers: [ActorService],
    controllers: [ActorController],
    exports: [ActorService],
})
export class ActorModule { }