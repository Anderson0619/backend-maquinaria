import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Response } from "express";
import jwt_decode from "jwt-decode";
import { User } from "src/user/schemas/user.schema";

export const ResGql = createParamDecorator(
  (data: unknown, context: ExecutionContext): Response =>
    GqlExecutionContext.create(context).getContext().res,
);

export const GqlUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req && ctx.req.user;
  },
);

export const GqlUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const token = ctx?.req?.headers?.authorization?.replace("Bearer null", "");
    let id = "";
    if (token) {
      const decoded: { id: string } = jwt_decode(token);
      id = decoded.id;
    }
    return id;
  },
);

export const VendorHostname = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx?.req?.headers.hostname;
  },
);
