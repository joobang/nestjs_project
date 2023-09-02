import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Payload } from "../security/payload.interface";

@Injectable()
export class JwtServiceStrategy extends PassportStrategy(Strategy, 'jwt-service'){
    constructor(private readonly configService: ConfigService){
        super({
            secretOrKey: configService.get('SECRET_KEY'),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: Payload) {
        return {
            id: payload.id,
            email: payload.email
        }
    }
}