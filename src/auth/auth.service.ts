import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private jwtService: JwtService
    ){}

    async validateServiceUser(email: string, password: string): Promise<any>{
        const user = await this.userRepo.findOne({
            where:{email}
        });

        if (!user){
            throw new ForbiddenException('User does not exist.')
        }

        if(!(await bcrypt.compare(password, user.password))) {
            throw new ForbiddenException('Passwords do not match.');
        }
        
        return user;
    }

    async loginServiceUser(user: UserEntity){
        const payload : Payload = {id: user.id, email: user.email};
        
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
