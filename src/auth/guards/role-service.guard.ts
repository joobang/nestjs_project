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

    const userSpace = await this.userSpaceService.getUserSpace(user_id, space_id);

    if(userSpace && userSpace.role.role_type === 'Admin' ){
        return true;
    }
    

    return false;
  }
}
