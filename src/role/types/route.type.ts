import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { RoutePathEnum } from "../enums/route-path.enum";

@ObjectType()
@InputType("RouteType")
export class Route {
  @Field()
  route: RoutePathEnum;

  @Field(() => [Route])
  childrens: Route[];
}
