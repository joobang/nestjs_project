import { Controller, UseGuards, Get,Post, Req, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalServiceAuthGuard } from './guards/local-service.guard';
import { Payload } from './security/payload.interface';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService){}

    @UseGuards(LocalServiceAuthGuard)
    @Post('login')
    async login(@Req() req,){
        this.logger.log('POST /auth/login has been executed')
        const payload: Payload = {id: req.user.id, email: req.user.email};
        const token = await this.authService.loginServiceUser(payload);
        return token;
    } 

}
