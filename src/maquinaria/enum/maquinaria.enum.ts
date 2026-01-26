export class Maquinaria {}
import { registerEnumType } from "@nestjs/graphql";

export enum MaquinariaStatusEnum {
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED",
}

registerEnumType(MaquinariaStatusEnum , { 
    name: 'MaquinariaStatusEnum',
    description: "Maquinaria status"
})