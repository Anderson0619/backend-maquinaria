export class Ubicacion {}
import { registerEnumType } from "@nestjs/graphql";

export enum UbicacionStatusEnum {
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED",
}

registerEnumType(UbicacionStatusEnum , { 
    name: 'UbicacionStatusEnum',
    description: "Ubicacion status"
})