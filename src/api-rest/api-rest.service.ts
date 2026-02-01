import { Injectable } from '@nestjs/common';
import { CreateApiRestDto } from './dto/create-api-rest.dto';
import { UpdateApiRestDto } from './dto/update-api-rest.dto';

@Injectable()
export class ApiRestService {
  create(createApiRestDto: CreateApiRestDto) {
    return 'This action adds a new apiRest';
  }

  findAll() {
    return `This action returns all apiRest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiRest`;
  }

  update(id: number, updateApiRestDto: UpdateApiRestDto) {
    return `This action updates a #${id} apiRest`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiRest`;
  }
}
