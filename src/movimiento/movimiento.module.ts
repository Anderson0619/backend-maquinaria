import { Module } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { MovimientoRepository } from './movimiento.repository';
import { MovimientoResolver } from './movimiento.resolver';

@Module({
  controllers: [],
  providers: [MovimientoService, MovimientoRepository, MovimientoResolver],
})
export class MovimientoModule {}
