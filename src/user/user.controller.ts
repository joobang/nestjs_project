import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post()
    async createUser(
        @Body('email') email: string,
        @Body('firstname') firstname: string,
        @Body('lastname') lastname: string,
        @Body('password') password: string,
        @Body('profile_path') profile_path: string,
    ){
        return await this.userService.createUser({email, firstname, lastname, password, profile_path});
    }
}
