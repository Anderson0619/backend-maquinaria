import { Module } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionResolver } from './ubicacion.resolver';
import { UbicacionRepository } from './ubicacion.repository';

@Module({
  controllers: [],
  providers: [UbicacionService, UbicacionResolver, UbicacionRepository],
})
export class UbicacionModule {}
