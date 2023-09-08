import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalServiceStrategy extends PassportStrategy(Strategy, 'local-service'){
    constructor(private authService: AuthService) {
        super({
            emailField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string): Promise<any>{
        const user = await this.authService.validateServiceUser(email, password);

        if (!user){
            throw new UnauthorizedException();
        }

        return user;
    }
    
}