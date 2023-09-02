import { Body, Controller, Get, Post, ValidationPipe,UsePipes, Param,Logger, UseGuards, Req, ParseIntPipe, Put, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { LocalServiceAuthGuard } from 'src/auth/guards/local-service.guard';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService){}

    @UseGuards(JwtServiceAuthGuard)
    @Get('myprofile')
    async getMyprofile(@Req() req){
        this.logger.log(`GET /user/myprofile has been executed`);
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
    async createUser(@Body() createUserDto: CreateUserDto
    ){
        this.logger.log('POST /user has been executed');
        const hashPassword = await this.userService.hashPassword(createUserDto.password);
        createUserDto.password = hashPassword;
        //console.log('Received values:', userEntity);
        return await this.userService.createUser(createUserDto);
    }

    @Put('myprofile')
    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    async putMyprofile(
        @Req() req, 
        @Body() body: any
    ){
        this.logger.log('PUT /user/myprofile has been executed');
        
        const { password_confirm, ...updateUserDto } = body;

        if(Object.keys(updateUserDto).length === 0){
            throw new ForbiddenException('You need to update at least one.')
        }

        // 비밀번호와 비밀번호 확인이 둘 다 제공되었을 때만 비밀번호를 수정하고
        // 둘 중 하나만 제공되었거나 두 값이 다를 경우 에러를 반환
        if( 'password' in updateUserDto || 'password_confirm' in updateUserDto){
            console.log(updateUserDto.password)
            console.log(password_confirm)
            if(updateUserDto.password !== password_confirm){
                throw new ForbiddenException('Password, password confirm do not match.');
            }

            const hashPassword = await this.userService.hashPassword(updateUserDto.password);
            updateUserDto.password = hashPassword
        }
        
        return await this.userService.putMyprofile(req.user.id, updateUserDto);
    }
}
