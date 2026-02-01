import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EntityRepository } from "src/customization/database/entity.repository";
import { MaquinariaDocument, Maquinaria } from "./maquinaria.schema";

@Injectable()
export class MaquinariaRepository extends EntityRepository<MaquinariaDocument>{
    constructor(@InjectModel(Maquinaria.name) maquinariaModel:  Model<MaquinariaDocument>){
        super(maquinariaModel);
    }
}