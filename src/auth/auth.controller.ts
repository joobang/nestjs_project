import { Controller, UseGuards, Get,Post, Req, Logger, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalServiceAuthGuard } from './guards/local-service.guard';
import { Payload } from './security/payload.interface';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService){}

    // jwt 토큰 발급을 위한 로그인 api
    @UseGuards(LocalServiceAuthGuard)
    @Post('login')
    async login(@Req() req, @Res({ passthrough: true}) res){
        this.logger.log('POST /auth/login has been executed')
        const payload: Payload = {id: req.user.id, email: req.user.email};
        const access_token = await this.authService.generateAccessToekn(payload);
        const refresh_token = await this.authService.generateRefreshToekn(payload);
        
        res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
        res.cookie('access_token', access_token, {
          httpOnly: true,
        });
        res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
        });
        
        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    } 

}
