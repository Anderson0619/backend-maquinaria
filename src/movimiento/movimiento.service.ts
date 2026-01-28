import { Injectable } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import { v4 as uuid } from 'uuid';
import { CreateMovimientoInput } from './inputs/create-movimiento.input';
import { UpdateMovimientoInput } from './inputs/update-movimiento.input';
import { DeleteMovimientoInput } from './inputs/delete-movimiento.input';
import { MovimientoRepository } from './movimiento.repository';  
import { Movimiento } from './movimiento.schema';
import moment = require('moment');
import { MovimientoStatusEnum } from './enum/movimiento.enum';

@Injectable()
export class MovimientoService {
  constructor(
    private readonly movimientoRepository: MovimientoRepository,
  ){}

  async create(createMovimientoInput: CreateMovimientoInput): Promise<Movimiento> {
    const movimiento = await this.movimientoRepository.findOne({
      movimientoNumber: createMovimientoInput.movimientoNumber,
    });

    const movimientos = await this.movimientoRepository.find({});

    const movimientoNumber = `${movimientos.length + 1} - ${'Movimiento'}`;

    if(movimiento){
      throw new UserInputError("Movimiento already exists");
    }

    const createdMovimiento = await this.movimientoRepository.create({
      ...createMovimientoInput,
      id: uuid(),
      movimientoNumber,
      createdAt: new Date(),
      deleted: false,
    })

    if(!createdMovimiento){
      throw new UserInputError("Veriy the entered data");
    }

    return createdMovimiento.save();
  }

   async findAll() {
    const movimientos = await this.movimientoRepository.find({deleted: false});

    return movimientos;
  }

  async findOne(id: string) {
    const movimiento = await this.movimientoRepository.findOne({id, deleted: false})

    if(!movimiento){
      throw new UserInputError("Movimiento not found");
    }
    return movimiento;
  }

  async findByStatus(status: MovimientoStatusEnum){
    const movimientos = await this.movimientoRepository.find({
      status,
      deleted: false,
    });
    if(movimientos.length === 0){
      throw new UserInputError("No Movimiento Found");
    }
    return movimientos;
  }

  async update(updateMovimientoInput: UpdateMovimientoInput) {
    const movimiento = await this.movimientoRepository.findOne({
      id: updateMovimientoInput.id,
      deleted: false,
    });

    if(!movimiento){
      throw new UserInputError("Movimiento not Found");
    }

    const updateMovimiento = await this.movimientoRepository.findOneAndUpdate(
      {id: updateMovimientoInput.id},
      updateMovimientoInput
    )

    if(!updateMovimiento){
      throw new UserInputError("Movimiento not updated");
    }

    return updateMovimiento;
  }

  async delete({id}: DeleteMovimientoInput) {
    const movimiento = await this.movimientoRepository.findOne({id});

    if(!movimiento){
      throw new UserInputError("Movimiento");
    }
    return this.movimientoRepository.findOneAndUpdate(
      {id}, 
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );
  }
}