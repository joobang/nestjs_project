import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-service') {
  canActivate(context: ExecutionContext) {
    if (process.env.NODE_ENV === 'dev') {
      return true;
    }
    return super.canActivate(context);
  }

}
