import { Injectable } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import { v4 as uuid } from 'uuid';
import { CreateUbicacionInput } from './inputs/create-ubicacion.input';
import { UpdateUbicacionInput } from './inputs/update-ubicacion.input';
import { DeleteUbicacionInput } from './inputs/delete-ubicacion.input';
import { UbicacionRepository } from './ubicacion.repository';  
import { Ubicacion } from './ubicacion.schema';
import moment = require('moment');
import { UbicacionStatusEnum } from './enum/ubicacion.enum';

@Injectable()
export class UbicacionService {
  constructor(
    private readonly ubicacionRepository: UbicacionRepository,
  ){}

  async create(createUbicacionInput: CreateUbicacionInput): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionRepository.findOne({
      ubiNumber: createUbicacionInput.ubiNumber,
    });

    const ubicaciones = await this.ubicacionRepository.find({});

    const ubiNumber = `${'Ubi'} - ${ubicaciones.length + 1}`;

    if(ubicacion){
      throw new UserInputError("Ubicacion already exists");
    }

    const createdUbicacion = await this.ubicacionRepository.create({
      ...createUbicacionInput,
      id: uuid(),
      ubiNumber,
      createdAt: new Date(),
      deleted: false,
    })

    if(!createdUbicacion){
      throw new UserInputError("Verify the entered data");
    }

    return createdUbicacion.save();
  }

   async findAll() {
    const ubicaciones = await this.ubicacionRepository.find({deleted: false});

    return ubicaciones;
  }

  async findOne(id: string) {
    const ubicacion = await this.ubicacionRepository.findOne({id, deleted: false})

    if(!ubicacion){
      throw new UserInputError("Ubicacion not found");
    }
    return ubicacion;
  }

  async findByStatus(status: UbicacionStatusEnum){
    const ubicaciones = await this.ubicacionRepository.find({
      status,
      deleted: false,
    });
    if(ubicaciones.length === 0){
      throw new UserInputError("No Ubicacion Found");
    }
    return ubicaciones;
  }

  async update(updateUbicacionInput: UpdateUbicacionInput) {
    const ubicacion = await this.ubicacionRepository.findOne({
      id: updateUbicacionInput.id,
      deleted: false,
    });

    if(!ubicacion){
      throw new UserInputError("Ubicacion not Found");
    }

    const updateUbicacion = await this.ubicacionRepository.findOneAndUpdate(
      {id: updateUbicacionInput.id},
      updateUbicacionInput
    )

    if(!updateUbicacion){
      throw new UserInputError("Ubicacion not updated");
    }

    return updateUbicacion;
  }

  async delete({id}: DeleteUbicacionInput) {
    const order = await this.ubicacionRepository.findOne({id});

    if(!order){
      throw new UserInputError("Ubicacion");
    }
    return this.ubicacionRepository.findOneAndUpdate(
      {id}, 
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );
  }
}