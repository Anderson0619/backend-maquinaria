import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guard/gql-auth.guard";
import { MovimientoStatusEnum } from "./enum/movimiento.enum";
import { CreateMovimientoInput } from "./inputs/create-movimiento.input";
import { DeleteMovimientoInput } from "./inputs/delete-movimiento.input";
import { UpdateMovimientoInput } from "./inputs/update-movimiento.input";
import { Movimiento } from "./movimiento.schema";
import { MovimientoService } from "./movimiento.service";

@Resolver(() => Movimiento)
export class MovimientoResolver {
    constructor (
        private readonly movimientoService: MovimientoService,
    ){}

    @Mutation(() => Movimiento, {description: "Create Movimiento"})
    @UseGuards(GqlAuthGuard)
    async createMovimiento(
        @Args("createMovimientoInput") createMovimientoInput: CreateMovimientoInput,
    ){
        return await this.movimientoService.create(createMovimientoInput);
    }

    @Query(() => [Movimiento], {name: "movimientos"})
    async findAll(){
        return await this.movimientoService.findAll();
    }

    @Query(() => [Movimiento], {name: "movimientosByStatus"})
    @UseGuards(GqlAuthGuard)
    async findByStatus(
        @Args("status", {type: () => MovimientoStatusEnum}) status: MovimientoStatusEnum
    ){
        return await this.movimientoService.findByStatus(status);
    }

    @Mutation(() => Movimiento)
    updateMovimiento(@Args("updateMovimientoInput") updateMovimientoInput: UpdateMovimientoInput){
        return this.movimientoService.update(updateMovimientoInput);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Movimiento)
    async deleteMovimiento(
        @Args("deleteMovimientoInput") deleteMovimientoInput: DeleteMovimientoInput,
    ){  
        return await this.movimientoService.delete(deleteMovimientoInput);
    }
}