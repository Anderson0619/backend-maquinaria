import { Controller, Get, Query } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { MovimientoStatusEnum } from './enum/movimiento.enum';

@Controller('rest/movimiento')  // URL: /rest/movimiento
export class MovimientoRestController {
  constructor(private readonly movimientoService: MovimientoService) {}

  /**
   * ENDPOINT POWER BI: Todas las máquinas
   * GET http://localhost:3001/rest/movimiento
   */
  @Get()
  async getAllForPowerBI(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('format') format?: string
  ) {
    const take = limit ? parseInt(limit) : 10000;
    const skip = page ? (parseInt(page) - 1) * take : 0;
    
    // Usa el mismo servicio que ya tienes
    const data = await this.movimientoService.findAll();
    
    // Aplicar paginación manualmente
    const paginatedData = data.slice(skip, skip + take);
    
    // Formato especial para Power BI si se solicita
    if (format === 'powerbi') {
      return {
        "@odata.context": "http://localhost:3001/rest/movimiento",
        "value": paginatedData,
        "@odata.count": data.length,
        "@odata.nextLink": data.length > skip + take 
          ? `http://localhost:3001/rest/movimiento?page=${(skip/take)+2}&limit=${take}`
          : null
      };
    }
    
    // Formato normal
    return {
      success: true,
      total: data.length,
      page: page ? parseInt(page) : 1,
      pageSize: take,
      data: paginatedData,
      exportedAt: new Date().toISOString(),
      source: 'MongoDB via REST API'
    };
  }

  /**
   * ENDPOINT POWER BI: Máquinas por estado
   * GET http://localhost:3001/rest/movimiento/estado?status=ACTIVO
   */
  @Get('estado')
  async getByStatus(
    @Query('status') status: MovimientoStatusEnum,
    @Query('limit') limit?: string
  ) {
    const take = limit ? parseInt(limit) : 5000;
    
    // Usa el mismo método de tu resolver
    const data = await this.movimientoService.findByStatus(status);
    
    return {
      success: true,
      status: status,
      count: data.length,
      data: data.slice(0, take),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * ENDPOINT POWER BI: Información de la colección
   * GET http://tuserver:3000/rest/movimiento/info
   */
  @Get('info')
  async getCollectionInfo() {
    const allData = await this.movimientoService.findAll();
    const sample = allData.length > 0 ? allData[0] : {};
    
    return {
      collection: 'movimiento',
      totalRecords: allData.length,
      fields: Object.keys(sample),
      sampleFieldTypes: this.inferTypes(sample),
      firstRecordDate: allData.length > 0 ? this.getFirstDate(allData) : null,
      lastRecordDate: allData.length > 0 ? this.getLastDate(allData) : null,
      mongoDB: 'connected',
      apiType: 'REST for Power BI',
      endpoints: {
        all: '/rest/movimiento',
        byStatus: '/rest/movimiento/estado?status=ACTIVO',
        info: '/rest/movimiento/info'
      }
    };
  }

  // Métodos auxiliares
  private inferTypes(obj: any): Record<string, string> {
    const types: Record<string, string> = {};
    for (const key in obj) {
      if (obj[key] instanceof Date) {
        types[key] = 'Date';
      } else if (typeof obj[key] === 'number') {
        types[key] = 'Number';
      } else if (typeof obj[key] === 'boolean') {
        types[key] = 'Boolean';
      } else if (Array.isArray(obj[key])) {
        types[key] = 'Array';
      } else {
        types[key] = typeof obj[key];
      }
    }
    return types;
  }

  private getFirstDate(data: any[]): string | null {
    const dates = data.map(d => d.createdAt || d.fecha_creacion || d.fecha).filter(Boolean);
    return dates.length > 0 ? new Date(Math.min(...dates.map(d => new Date(d).getTime()))).toISOString() : null;
  }

  private getLastDate(data: any[]): string | null {
    const dates = data.map(d => d.updatedAt || d.fecha_actualizacion || d.fecha).filter(Boolean);
    return dates.length > 0 ? new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString() : null;
  }
}