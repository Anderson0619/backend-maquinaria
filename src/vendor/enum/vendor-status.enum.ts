import { registerEnumType } from '@nestjs/graphql';

export enum VendorStatusEnum {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  DOWN = 'DOWN',
}

registerEnumType(VendorStatusEnum, {
  name: 'VendorStatusEnum',
  description: 'Vendor site status',
});
