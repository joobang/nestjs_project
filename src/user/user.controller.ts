import { Body, Controller, Get, Post, ValidationPipe,UsePipes, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return await this.userService.getUserById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createUser(@Body() userEntity: UserEntity
    ){
        const hashPassword = await this.userService.hashPassword(userEntity.password);
        userEntity.password = hashPassword;
        console.log('Received values:', userEntity);
        return await this.userService.createUser(userEntity);
    }
}
