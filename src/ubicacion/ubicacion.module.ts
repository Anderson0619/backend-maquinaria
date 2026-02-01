import { Module } from '@nestjs/common';
import { UbicacionService } from './ubicacion.service';
import { UbicacionResolver } from './ubicacion.resolver';
import { UbicacionRepository } from './ubicacion.repository';
import { UbicacionRestController } from './ubicacion-rest.controller';

@Module({
  controllers: [UbicacionRestController],
  providers: [UbicacionService, UbicacionResolver, UbicacionRepository],
})
export class UbicacionModule {}
