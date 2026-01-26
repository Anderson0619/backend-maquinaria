import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EntityRepository } from "src/customization/database/entity.repository";
import { UbicacionDocument, Ubicacion } from "./ubicacion.schema";

@Injectable()
export class UbicacionRepository extends EntityRepository<UbicacionDocument>{
    constructor(@InjectModel(Ubicacion.name) ubicacionModel:  Model<UbicacionDocument>){
        super(ubicacionModel);
    }
}