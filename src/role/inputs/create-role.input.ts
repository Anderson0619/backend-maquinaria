import { Field, InputType } from "@nestjs/graphql";
import { RoutePathEnum } from "../enums/route-path.enum";

@InputType()
export class CreateRoleInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [RoutePathEnum], { defaultValue: [] })
  routes: RoutePathEnum[];

  @Field({ defaultValue: true })
  deletable?: boolean;

  @Field({ defaultValue: true })
  editable: boolean;
}
