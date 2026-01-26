import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guard/gql-auth.guard";
import { UbicacionStatusEnum } from "./enum/ubicacion.enum";
import { CreateUbicacionInput } from "./inputs/create-ubicacion.input";
import { DeleteUbicacionInput } from "./inputs/delete-ubicacion.input";
import { UpdateUbicacionInput } from "./inputs/update-ubicacion.input";
import { Ubicacion } from "./ubicacion.schema";
import { UbicacionService } from "./ubicacion.service";

@Resolver(() => Ubicacion)
export class UbicacionResolver {
    constructor (
        private readonly ubicacionService: UbicacionService,
    ){}

    @Mutation(() => Ubicacion, {description: "Create Ubicacion"})
    @UseGuards(GqlAuthGuard)
    async createUbicacion(
        @Args("createUbicacionInput") createUbicacionInput: CreateUbicacionInput,
    ){
        return await this.ubicacionService.create(createUbicacionInput);
    }

    @Query(() => [Ubicacion], {name: "ubicaciones"})
    async findAll(){
        return await this.ubicacionService.findAll();
    }

    @Query(() => [Ubicacion], {name: "ubicacionesByStatus"})
    @UseGuards(GqlAuthGuard)
    async findByStatus(
        @Args("status", {type: () => UbicacionStatusEnum}) status: UbicacionStatusEnum
    ){
        return await this.ubicacionService.findByStatus(status);
    }

    @Mutation(() => Ubicacion)
    updateUbicacion(@Args("updateUbicacionInput") updateUbicacionInput: UpdateUbicacionInput){
        return this.ubicacionService.update(updateUbicacionInput);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Ubicacion)
    async deleteUbicacion(
        @Args("deleteUbicacionInput") deleteUbicacionInput: DeleteUbicacionInput,
    ){  
        return await this.ubicacionService.delete(deleteUbicacionInput);
    }
}