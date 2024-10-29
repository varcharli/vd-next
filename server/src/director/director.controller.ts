import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DirectorService } from './director.service';
import { Director } from './director.entity';

@Controller('directors')
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @Post()
  create(@Body() director: Director): Promise<Director> {
    return this.directorService.create(director);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() director: Director): Promise<Director> {
    return this.directorService.update(id, director);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Boolean> {
    return this.directorService.delete(id);
  }

  @Get()
  findAll(): Promise<Director[]> {
    return this.directorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Director> {
    return this.directorService.findOne(id);
  }
}