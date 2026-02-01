import { Controller, Get, Query } from '@nestjs/common';
import { MaquinariaService } from './maquinaria.service';
import { MovimientoService } from '../movimiento/movimiento.service'; 
import { UbicacionService } from 'src/ubicacion/ubicacion.service';
import { MaquinariaStatusEnum } from './enum/maquinaria.enum';

@Controller('rest')  // CAMBIAR de 'rest/maquinaria' a solo 'rest'
export class MaquinariaRestController {
  constructor(
    private readonly maquinariaService: MaquinariaService,
    private readonly movimientoService: MovimientoService, 
    private readonly ubicacionService: UbicacionService
  ) {}

  // ========== ENDPOINTS DE MAQUINARIA ==========

  /**
   * TODAS LAS MÁQUINAS
   * GET http://localhost:3001/rest/maquinaria
   */
  @Get('maquinaria')
  async getAllMaquinaria(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('format') format?: string
  ) {
    const take = limit ? parseInt(limit) : 10000;
    const skip = page ? (parseInt(page) - 1) * take : 0;
    
    const data = await this.maquinariaService.findAll();
    const paginatedData = data.slice(skip, skip + take);
    
    if (format === 'powerbi') {
      return {
        "@odata.context": "http://localhost:3001/rest/maquinaria",
        "value": paginatedData,
        "@odata.count": data.length,
        "@odata.nextLink": data.length > skip + take 
          ? `http://localhost:3001/rest/maquinaria?page=${(skip/take)+2}&limit=${take}`
          : null
      };
    }
    
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
   * MÁQUINAS POR ESTADO
   * GET http://localhost:3001/rest/maquinaria/estado?status=ACTIVO
   */
  @Get('maquinaria/estado')
  async getMaquinariaByStatus(
    @Query('status') status: MaquinariaStatusEnum,
    @Query('limit') limit?: string
  ) {
    const take = limit ? parseInt(limit) : 5000;
    
    const data = await this.maquinariaService.findByStatus(status);
    
    return {
      success: true,
      status: status,
      count: data.length,
      data: data.slice(0, take),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * INFORMACIÓN DE LA COLECCIÓN MAQUINARIA
   * GET http://localhost:3001/rest/maquinaria/info
   */
  @Get('maquinaria/info')
  async getMaquinariaInfo() {
    const allData = await this.maquinariaService.findAll();
    const sample = allData.length > 0 ? allData[0] : {};
    
    return {
      collection: 'maquinaria',
      totalRecords: allData.length,
      fields: Object.keys(sample),
      sampleFieldTypes: this.inferTypes(sample),
      firstRecordDate: allData.length > 0 ? this.getFirstDate(allData) : null,
      lastRecordDate: allData.length > 0 ? this.getLastDate(allData) : null,
      mongoDB: 'connected',
      apiType: 'REST for Power BI',
      endpoints: {
        all: '/rest/maquinaria',
        byStatus: '/rest/maquinaria/estado?status=ACTIVO',
        info: '/rest/maquinaria/info'
      }
    };
  }

  // ========== ENDPOINTS DE MOVIMIENTO ==========

  /**
   * TODOS LOS MOVIMIENTOS
   * GET http://localhost:3001/rest/movimientos
   */
  @Get('movimientos')
  async getAllMovimientos(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('format') format?: string
  ) {
    const take = limit ? parseInt(limit) : 50000;
    const skip = page ? (parseInt(page) - 1) * take : 0;
    
    const data = await this.movimientoService.findAll();
    const paginatedData = data.slice(skip, skip + take);
    
    return {
      success: true,
      total: data.length,
      page: page ? parseInt(page) : 1,
      pageSize: take,
      data: paginatedData,
      exportedAt: new Date().toISOString()
    };
  }

   // ========== ENDPOINTS DE UBICACIONES ==========

  /**
   * TODAS LAS UBICACIONES
   * GET http://localhost:3001/rest/ubicaciones
   */
  @Get('ubicaciones')
  async getAllUbicaciones(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('format') format?: string
  ) {
    const take = limit ? parseInt(limit) : 50000;
    const skip = page ? (parseInt(page) - 1) * take : 0;
    
    const data = await this.ubicacionService.findAll();
    const paginatedData = data.slice(skip, skip + take);
    
    return {
      success: true,
      total: data.length,
      page: page ? parseInt(page) : 1,
      pageSize: take,
      data: paginatedData,
      exportedAt: new Date().toISOString()
    };
  }

  // ========== NUEVO: ENDPOINT UNIFICADO PARA POWER BI ==========

  /**
   * TODAS LAS TABLAS JUNTAS - PARA POWER BI
   * GET http://localhost:3001/rest/todo
   */
  @Get('todo')
  async getAllTables() {
    try {
      console.log('🔄 Obteniendo todas las tablas para Power BI...');
      
      const [maquinarias, movimientos, ubicaciones] = await Promise.all([
        this.maquinariaService.findAll(),
        this.movimientoService.findAll(),
        this.ubicacionService.findAll()
      ]);
      
      console.log(`✅ Maquinarias: ${maquinarias.length} registros`);
      console.log(`✅ Movimientos: ${movimientos.length} registros`);
      console.log(`✅ Ubicaciones: ${ubicaciones.length} registros`);
      
      // Formato que Power BI entiende fácilmente
      return {
        // Dos arrays en primer nivel - Power BI los detecta como tablas
        TablaMaquinarias: maquinarias,
        TablaMovimientos: movimientos,
        TablaUbicaciones: ubicaciones,
        
        // Información adicional
        _metadata: {
          exportado: new Date().toISOString(),
          totalMaquinarias: maquinarias.length,
          totalMovimientos: movimientos.length,
          totalUbicaciones: ubicaciones.length,
          totalRegistros: maquinarias.length + movimientos.length + ubicaciones.length,
          formato: 'power_bi_compatible',
          instrucciones: 'Power BI detectará automáticamente TablaMaquinarias, Ubicaciones y TablaMovimientos como tablas separadas'
        }
      };
      
    } catch (error) {
      console.error('❌ Error al obtener todas las tablas:', error);
      return {
        error: true,
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * RESUMEN DE TODAS LAS TABLAS
   * GET http://localhost:3001/rest/resumen
   */
  @Get('resumen')
  async getResumen() {
    const [maquinarias, movimientos, ubicaciones] = await Promise.all([
      this.maquinariaService.findAll(),
      this.movimientoService.findAll(),
      this.ubicacionService.findAll()
    ]);
    
    return {
      resumen: {
        maquinarias: {
          total: maquinarias.length,
          estados: this.groupBy(maquinarias, 'estado'),
          fechas: {
            primera: this.getFirstDate(maquinarias),
            ultima: this.getLastDate(maquinarias)
          }
        },
        movimientos: {
          total: movimientos.length,
          fechas: {
            primera: this.getFirstDate(movimientos),
            ultima: this.getLastDate(movimientos)
          }
        },
        ubicaciones: {
          total: ubicaciones.length,
          estados: this.groupBy(ubicaciones, 'estado'),
        }
      },
      totalGeneral: maquinarias.length + movimientos.length + ubicaciones.length,
      generado: new Date().toISOString()
    };
  }

  // ========== MÉTODOS AUXILIARES ==========

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
    const dates = data.map(d => d.createdAt || d.fecha_creacion || d.fecha || d.fechaS).filter(Boolean);
    return dates.length > 0 ? new Date(Math.min(...dates.map(d => new Date(d).getTime()))).toISOString() : null;
  }

  private getLastDate(data: any[]): string | null {
    const dates = data.map(d => d.updatedAt || d.fecha_actualizacion || d.fecha || d.fechaS).filter(Boolean);
    return dates.length > 0 ? new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString() : null;
  }

  private groupBy(data: any[], field: string): Record<string, number> {
    if (!data || data.length === 0) return {};
    
    return data.reduce((acc: Record<string, number>, item) => {
      const key = item[field] || 'No especificado';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }
}