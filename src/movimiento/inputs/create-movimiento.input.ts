import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMovimientoInput {
  @Field(() => String, { description: 'Movimiento' })
  movimientoNumber: string;

  @Field(() => [String], { defaultValue: [] })
  maquinaria?: string[];

  @Field(() => String, { nullable: true })
  solicitante?: string;

  @Field(() => String, { nullable: true })
  autoriza?: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  traslado?: string[];

  @Field(() => [String], { defaultValue: [], nullable: true })
  origen?: string[];

  @Field(() => String, { nullable: true })
  fechaS?: string;

  @Field(() => String, { nullable: true })
  fechaT?: string;

  @Field(() => String, { nullable: true })
  movimiento?: string;
}