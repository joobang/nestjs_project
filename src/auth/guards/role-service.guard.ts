import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserSpaceService } from 'src/userspace/userspace.service';


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly userSpaceService: UserSpaceService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user_id = request.user.id; 
    const space_id = request.body.space_id;

    // 로그인 id와 공간 id로 조건에 맞는 공간 역할을 찾는다.
    const userSpace = await this.userSpaceService.getUserSpace(user_id, space_id);
    // userspace에 존재하고 권한 타입이 admin 인지 체크
    if(userSpace && userSpace.role.role_type === 'Admin' ){
        return true;
    }
    

    return false;
  }
}
