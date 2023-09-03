import { Body, Controller, Get, Post, ValidationPipe,UsePipes, Param,Logger, UseGuards, Req, ParseIntPipe, Put, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateParamDto } from './dto/update-param.dto';


@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService){}

    @UseGuards(JwtServiceAuthGuard)
    @Get('myprofile')
    async getMyprofile(@Req() req){
        this.logger.log(`GET /user/myprofile has been executed`);
        const profile =await this.userService.getMyprofile(req.user.id);
        return Object.assign({
            data: { ...profile },
            statusCode: 200,
            statusMsg: 'get myprofile'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @Get(':id')
    async getUserById(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`GET /user/${id} has been executed`);
        const getUserById = await this.userService.getUserById(id);
        return Object.assign({
            data: { ...getUserById },
            statusCode: 200,
            statusMsg: 'get UserById'
        })
    }

 
    @Post()
    @UsePipes(ValidationPipe)
    async createUser(@Body() createUserDto: CreateUserDto
    ){
        this.logger.log('POST /user has been executed');
        const hashPassword = await this.userService.hashPassword(createUserDto.password);
        createUserDto.password = hashPassword;
        //console.log('Received values:', userEntity);
        await this.userService.createUser(createUserDto);
        return Object.assign({
            statusCode: 200,
            statusMsg: 'User register success'
        })
    }

    @Put('myprofile')
    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    async putMyprofile(
        @Req() req, 
        @Body() updateParmDto: UpdateParamDto
    ){
        this.logger.log('PUT /user/myprofile has been executed');
        
        const { password_confirm, ...body} = updateParmDto;
        const updateUserDto: UpdateUserDto = body;
        
        if('email' in updateParmDto){
            throw new ForbiddenException('Email cannot be changed.');
        }
        if(Object.keys(updateParmDto).length === 0){
            throw new ForbiddenException('You need to update at least one.');
        }

        // 비밀번호와 비밀번호 확인이 둘 다 제공되었을 때만 비밀번호를 수정하고
        // 둘 중 하나만 제공되었거나 두 값이 다를 경우 에러를 반환
        if( 'password' in updateParmDto || 'password_confirm' in updateParmDto){
            if(updateParmDto.password !== updateParmDto.password_confirm){
                throw new ForbiddenException('Password, password confirm do not match.');
            }

            const hashPassword = await this.userService.hashPassword(updateParmDto.password);
            updateUserDto.password = hashPassword
        }
        
        const updateUser = await this.userService.putMyprofile(req.user.id, updateUserDto);
        return Object.assign({
            data: { ...updateUser},
            statusCode: 200,
            statusMsg: 'User update success'
        })
    }


}
