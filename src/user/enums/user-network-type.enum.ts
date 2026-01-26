import { registerEnumType } from '@nestjs/graphql'

export enum UserNetworkTypeEnum {
  WEB = 'WEB',
  FACEBOOK = 'FACEBOOK',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  LINKEDIN = 'LINKEDIN',
}

registerEnumType(UserNetworkTypeEnum, {
  name: 'UserNetworkTypeEnum',
  description: 'User network type enum',
});
