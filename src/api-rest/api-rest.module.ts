import { Module } from '@nestjs/common';
import { MaquinariaModule } from '../maquinaria/maquinaria.module';  // Importar
import { MovimientoModule } from '../movimiento/movimiento.module';  // Importar
import { UnifiedRestController } from './api-rest.controller';

@Module({
  imports: [
    MaquinariaModule,   
    MovimientoModule,   
  ],
  controllers: [UnifiedRestController],
})
export class ApiRestModule {}