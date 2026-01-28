import { Injectable } from '@nestjs/common';
import { UserInputError } from 'apollo-server-express';
import { v4 as uuid } from 'uuid';
import { CreateMaquinariaInput } from './inputs/create-maquinaria.input';
import { UpdateMaquinariaInput } from './inputs/update-maquinaria.input';
import { DeleteMaquinariaInput } from './inputs/delete-maquinaria.input';
import { MaquinariaRepository } from './maquinaria.respository';  
import { Maquinaria } from './maquinaria.schema';
import moment = require('moment');
import { MaquinariaStatusEnum } from './enum/maquinaria.enum';

@Injectable()
export class MaquinariaService {
  constructor(
    private readonly maquinariaRepository: MaquinariaRepository,
  ){}

  async create(createMaquinariaInput: CreateMaquinariaInput): Promise<Maquinaria> {
    const maquinaria = await this.maquinariaRepository.findOne({
      maquiNumber: createMaquinariaInput.maquiNumber,
      deleted: false,
    });

    //const maquinarias = await this.maquinariaRepository.find({});

    //const maquiNumber = `${maquinarias.length + 1} - ${'Maquinaria'}`;

    if(maquinaria){
      throw new UserInputError("Análisis already exists");
    }

    const createdMaquinaria = await this.maquinariaRepository.create({
      ...createMaquinariaInput,
      id: uuid(),
      //maquiNumber,
      createdAt: new Date(),
      deleted: false,
    })

    if(!createdMaquinaria){
      throw new UserInputError("Veriy the entered data");
    }

    return createdMaquinaria.save();
  }

   async findAll() {
    const maquinarias = await this.maquinariaRepository.find({deleted: false});

    return maquinarias;
  }

  async findOne(id: string) {
    const maquinaria = await this.maquinariaRepository.findOne({id, deleted: false})

    if(!maquinaria){
      throw new UserInputError("Maquinaria not found");
    }
    return maquinaria;
  }

  async findByStatus(status: MaquinariaStatusEnum){
    const maquinarias = await this.maquinariaRepository.find({
      status,
      deleted: false,
    });
    if(maquinarias.length === 0){
      throw new UserInputError("No Maquinaria Found");
    }
    return maquinarias;
  }

  async update(updateMaquinariaInput: UpdateMaquinariaInput) {
    const maquinaria = await this.maquinariaRepository.findOne({
      id: updateMaquinariaInput.id,
      deleted: false,
    });

    if(!maquinaria){
      throw new UserInputError("Maquinaria not Found");
    }

    const updateMaquinaria = await this.maquinariaRepository.findOneAndUpdate(
      {id: updateMaquinariaInput.id},
      updateMaquinariaInput
    )

    if(!updateMaquinaria){
      throw new UserInputError("Maquinaria not updated");
    }

    return updateMaquinaria;
  }

  async delete({id}: DeleteMaquinariaInput) {
    const order = await this.maquinariaRepository.findOne({id});

    if(!order){
      throw new UserInputError("Maquinaria");
    }
    return this.maquinariaRepository.findOneAndUpdate(
      {id}, 
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );
  }
}