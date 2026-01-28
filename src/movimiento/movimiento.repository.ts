import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EntityRepository } from "src/customization/database/entity.repository";
import { MovimientoDocument, Movimiento } from "./movimiento.schema";

@Injectable()
export class MovimientoRepository extends EntityRepository<MovimientoDocument>{
    constructor(@InjectModel(Movimiento.name) movimientoModel:  Model<MovimientoDocument>){
        super(movimientoModel);
    }
}