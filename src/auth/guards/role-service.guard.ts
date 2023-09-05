import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserMeetingService } from 'src/usermeeting/usermeeting.service';


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly userMeetingService: UserMeetingService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user_id = request.user.id; 
    const meeting_id = request.body.meeting_id;

    // 로그인 id와 공간 id로 조건에 맞는 공간 역할을 찾는다.
    const userMeeting = await this.userMeetingService.getUserMeeting(user_id, meeting_id);
    // usermeeting에 존재하고 권한 타입이 admin 인지 체크
    if(userMeeting && userMeeting.role.role_type === 'Admin' ){
        return true;
    }
    

    return false;
  }
}
