import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){
        //console.log(this.jwtService);
    }

    async validateServiceUser(email: string, password: string): Promise<any>{
        const user = await this.userRepo.findOne({
            where:{email}
        }); 
        // 유저 존재 유무 체크
        if (!user){
            throw new ForbiddenException('User does not exist.')
        }
        // 비밀번호 일치 체크
        if(!(await bcrypt.compare(password, user.password))) {
            throw new ForbiddenException('Passwords do not match.');
        }
        
        return user;
    }

    async generateAccessToekn(payload: Payload){
        return this.jwtService.signAsync(payload);
    }

    async generateRefreshToekn(payload: Payload){
        return this.jwtService.signAsync({id: payload.id}, {
            secret: this.configService.get<string>('SECRET_KEY'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
        });
    }
}
