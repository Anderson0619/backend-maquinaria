import { registerEnumType } from "@nestjs/graphql";

export enum RoutePathEnum {
  COMPONENTS = "COMPONENTS",
  PROFILE = "PROFILE",
  SITE_CONFIG = "SITE_CONFIG",
  LANDING = "LANDING",
  NOTFOUND = "NOTFOUND",
  LOGIN = "LOGIN",
  ROLES = "ROLES",
  USERS = "USERS",
  VENDORS = "VENDORS",
  MAQUINARIA = "MAQUINARIA",
  UBICACION = "UBICACION",
  
}

registerEnumType(RoutePathEnum, {
  name: "RoutePathEnum",
  description: "RoutePathEnum enum type",
});
