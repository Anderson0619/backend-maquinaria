import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guard/gql-auth.guard";
import { MaquinariaStatusEnum } from "./enum/maquinaria.enum";
import { CreateMaquinariaInput } from "./inputs/create-maquinaria.input";
import { DeleteMaquinariaInput } from "./inputs/delete-maquinaria.input";
import { UpdateMaquinariaInput } from "./inputs/update-maquinaria.input";
import { Maquinaria } from "./maquinaria.schema";
import { MaquinariaService } from "./maquinaria.service";

@Resolver(() => Maquinaria)
export class MaquinariaResolver {
    constructor (
        private readonly maquinariaService: MaquinariaService,
    ){}

    @Mutation(() => Maquinaria, {description: "Create Maquinaria"})
    @UseGuards(GqlAuthGuard)
    async createMaquinaria(
        @Args("createMaquinariaInput") createMaquinariaInput: CreateMaquinariaInput,
    ){
        return await this.maquinariaService.create(createMaquinariaInput);
    }

    @Query(() => [Maquinaria], {name: "maquinarias"})
    async findAll(){
        return await this.maquinariaService.findAll();
    }

    @Query(() => [Maquinaria], {name: "maquinariasByStatus"})
    @UseGuards(GqlAuthGuard)
    async findByStatus(
        @Args("status", {type: () => MaquinariaStatusEnum}) status: MaquinariaStatusEnum
    ){
        return await this.maquinariaService.findByStatus(status);
    }

    @Mutation(() => Maquinaria)
    updateMaquinaria(@Args("updateMaquinariaInput") updateMaquinariaInput: UpdateMaquinariaInput){
        return this.maquinariaService.update(updateMaquinariaInput);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => Maquinaria)
    async deleteMaquinaria(
        @Args("deleteMaquinariaInput") deleteMaquinariaInput: DeleteMaquinariaInput,
    ){  
        return await this.maquinariaService.delete(deleteMaquinariaInput);
    }
}