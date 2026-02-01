import { Module } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { MovimientoRepository } from './movimiento.repository';
import { MovimientoResolver } from './movimiento.resolver';
import { MovimientoRestController } from './movimiento-rest.controller';

@Module({
  controllers: [MovimientoRestController],
  providers: [MovimientoService, MovimientoRepository, MovimientoResolver],
  exports: [MovimientoService]
})
export class MovimientoModule {}
