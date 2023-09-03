import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

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

    async hashPassword(password: string){
        return await bcrypt.hash(password, 11);
    }

    async getUserById(id: number){
        const user: UserEntity = await this.UserRepo.findOne({ id });
        if(!user){
            throw new NotFoundException('User not exists');
        }
        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            profile_path: user.profile_path
        }
    }

    async getMyprofile(id: number){
        const user: UserEntity = await this.UserRepo.findOne({ id });
        return user.toResponseObject();
    }

    async putMyprofile(id: number, updateUserDto: UpdateUserDto){
        await this.UserRepo.update(id, updateUserDto);
        return this.getMyprofile(id);
    }
}
