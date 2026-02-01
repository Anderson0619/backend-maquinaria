import { PartialType } from '@nestjs/swagger';
import { CreateApiRestDto } from './create-api-rest.dto';

export class UpdateApiRestDto extends PartialType(CreateApiRestDto) {}
