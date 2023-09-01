import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly UserRepo: Repository<UserEntity>,
    ) {}

    async createUser({ email, firstname, lastname, password, profile_path}){
        const isUserExist = await this.UserRepo.findOne({ email });
        if(isUserExist){
            throw new ConflictException('Email already exists');
        }
        return await this.UserRepo.save({
            email,
            firstname,
            lastname,
            password,
            profile_path
        })
    }
}
