export class Movimiento {}
import { registerEnumType } from "@nestjs/graphql";

export enum MovimientoStatusEnum {
    ACTIVE = "ACTIVE",
    DEACTIVATED = "DEACTIVATED",
}

registerEnumType(MovimientoStatusEnum , { 
    name: 'MovimientoStatusEnum',
    description: "Movimiento status"
})