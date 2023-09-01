import { Body, Controller, Get, Post, ValidationPipe,UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    @UsePipes(ValidationPipe)
    async createUser(@Body() userEntity: UserEntity
    ){
        console.log('Received values:', userEntity);

        return await this.userService.createUser(userEntity);
    }
}
