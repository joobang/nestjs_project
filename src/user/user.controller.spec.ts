import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      controllers: [UserController]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('getHelloWorld() 의 실행 결과 테스트', () => {
    const result = controller.getHelloWorld();
    expect(result).toEqual('Hello World!!');
  });
});
