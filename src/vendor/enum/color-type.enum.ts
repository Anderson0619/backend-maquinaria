import { registerEnumType } from '@nestjs/graphql'

export enum EColorType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

registerEnumType(EColorType, {
    name: 'EColorType',
    description: 'EColorType site status',
})
