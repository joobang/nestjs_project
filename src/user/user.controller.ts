import { Body, Controller, Get, Post, ValidationPipe,UsePipes, Param,Logger, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { LocalServiceAuthGuard } from 'src/auth/guards/local-service.guard';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService){}

    @UseGuards(JwtServiceAuthGuard)
    @Get('myprofile')
    async getMyprofile(@Req() req){
        this.logger.log(`GET /user/myprofile has been executed`);
        console.log(req.user)
        return await this.userService.getMyprofile(req.user.id);
    }

    @UseGuards(JwtServiceAuthGuard)
    @Get(':id')
    async getUserById(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`GET /user/${id} has been executed`);
        return await this.userService.getUserById(id);
    }

 
    @Post()
    @UsePipes(ValidationPipe)
    async createUser(@Body() userEntity: UserEntity
    ){
        this.logger.log('POST /user has been executed');
        const hashPassword = await this.userService.hashPassword(userEntity.password);
        userEntity.password = hashPassword;
        //console.log('Received values:', userEntity);
        return await this.userService.createUser(userEntity);
    }
}
