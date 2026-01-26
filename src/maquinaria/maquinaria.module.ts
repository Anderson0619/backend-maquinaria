import { Module } from '@nestjs/common';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaResolver } from './maquinaria.resolver';
import { MaquinariaRepository } from './maquinaria.respository';

@Module({
  controllers: [],
  providers: [MaquinariaService, MaquinariaResolver, MaquinariaRepository],
})
export class MaquinariaModule {}
