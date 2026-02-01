import { Test, TestingModule } from '@nestjs/testing';
import { ApiRestController } from './api-rest.controller';
import { ApiRestService } from './api-rest.service';

describe('ApiRestController', () => {
  let controller: ApiRestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiRestController],
      providers: [ApiRestService],
    }).compile();

    controller = module.get<ApiRestController>(ApiRestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
