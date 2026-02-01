import { Controller, Get } from '@nestjs/common';
import { MaquinariaService } from '../maquinaria/maquinaria.service';
import { MovimientoService } from '../movimiento/movimiento.service';

@Controller('powerbi-todo')  // URL: /powerbi-todo
export class UnifiedRestController {
  constructor(
    private readonly maquinariaService: MaquinariaService,
    private readonly movimientoService: MovimientoService,
  ) {}

  /**
   * ENDPOINT QUE SÍ FUNCIONA - SUPER SIMPLE
   * GET http://localhost:3001/powerbi-todo/todo
   */
  @Get('todo')
  async getTodo() {
    try {
      // Obtener datos de AMBAS colecciones
      const [maquinarias, movimientos] = await Promise.all([
        this.maquinariaService.findAll(),
        this.movimientoService.findAll()
      ]);
      
      // Formato SUPER SIMPLE que Power BI entiende
      return {
        // Dos arrays en primer nivel
        maquinarias: maquinarias,
        movimientos: movimientos
      };
    } catch (error) {
      return {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}