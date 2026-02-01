import { Module } from '@nestjs/common';
import { MaquinariaService } from './maquinaria.service';
import { MaquinariaResolver } from './maquinaria.resolver';
import { MaquinariaRepository } from './maquinaria.repository';
import { MaquinariaRestController } from './maquinaria-rest.controller';
import { MovimientoService } from '../movimiento/movimiento.service';
import { MovimientoRepository } from 'src/movimiento/movimiento.repository';
import { MovimientoResolver } from 'src/movimiento/movimiento.resolver';
import { UbicacionService } from 'src/ubicacion/ubicacion.service';
import { UbicacionRepository } from 'src/ubicacion/ubicacion.repository';
import { UbicacionResolver } from 'src/ubicacion/ubicacion.resolver';

@Module({
  controllers: [MaquinariaRestController],
  providers: [MaquinariaService, MaquinariaResolver, MaquinariaRepository, MovimientoService, MovimientoRepository, MovimientoResolver, UbicacionService, UbicacionRepository, UbicacionResolver],
  exports: [MaquinariaService],
})
export class MaquinariaModule {}
