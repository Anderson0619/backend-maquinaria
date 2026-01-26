import { registerEnumType } from "@nestjs/graphql";

export enum EmailTemplateEnum {
  WELCOME_EMAIL_TEMPLATE = "d-508c89aad837430287a57e90be825080",
  RESET_PASSWORD_TEMPLATE = "d-7ba60e2086444757a2ec2ea6c131b0e3",
  SUCCESS_RESET_PASSWORD_TEMPLATE = "d-40ef5a1ceaaa49c682b088c688d4a916",
}

registerEnumType(EmailTemplateEnum, {
  name: "EmailTemplateEnum",
  description: "EmailTemplateEnum type enum",
});
