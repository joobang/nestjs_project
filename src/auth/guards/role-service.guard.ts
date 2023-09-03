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
    const param_id = +request.params.id; 

    // const userSpace = await this.userSpaceService.findUserSpace(userId, spaceId);

    // if (userSpace && userSpace.space_role_id === '관리자_아이디') {
    //   return true;
    // }

    return false;
  }
}
