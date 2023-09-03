import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceService } from './space.service';
import { CreateSpaceParamDto } from './dto/create-param.dto';
import { JoinSpaceDto } from './dto/join-space.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { DeleteSpaceDto } from './dto/delete-space.dto';
import { RolesGuard } from 'src/auth/guards/role-service.guard';

@Controller('space')
export class SpaceController {
    private readonly logger = new Logger(SpaceController.name);
    constructor(private readonly spaceService: SpaceService){}

    // 공간 생성
    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async createSpace(@Req() req, @Body() createSpaceParamDto: CreateSpaceParamDto){
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`POST /space has been executed`);
          }
        await this.spaceService.createSpace(req.user.id, createSpaceParamDto);
        return Object.assign({
            statusCode: 200,
            statusMsg: 'create space'
        })
    }

    // 내가 속한 공간정보
    @UseGuards(JwtServiceAuthGuard)
    @Get('myspace')
    async getMyprofile(@Req() req){
        
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`GET /space/myspace has been executed`);
        }
        const space = await this.spaceService.getMySpace(req.user.id);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'get my space'
        })
    }

    // 공간 참여
    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post('join')
    async joinSpace(@Req() req, @Body() joinSpaceDto: JoinSpaceDto){
        
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`POST /space/join has been executed`);
        }
        const space = await this.spaceService.joinSpace(req.user.id, joinSpaceDto);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'join space'
        })
    }

    // 참여코드로 공간정보 가져오기
    @UseGuards(JwtServiceAuthGuard)
    @Get(':joincode')
    async getJoincodeInfo(@Req() req, @Param('joincode') joincode: string){

        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`GET /space/${joincode} has been executed`);
        }
        const space = await this.spaceService.getJoincodeInfo(req.user.id, joincode);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'get joincode Info'
        })
    }

    // 공간 역할 삭제
    @UseGuards(JwtServiceAuthGuard, RolesGuard)
    @Delete('role')
    async deleteRoleById(@Req() req, @Body() deleteRoleDto: DeleteRoleDto){

        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`PUT /space/role has been executed`);
        }
        const role = await this.spaceService.deleteRoleById(req.user.id, deleteRoleDto);
        return Object.assign({
            data: role ,
            statusCode: 200,
            statusMsg: 'delete role success'
        })
    }

    // 공간 삭제
    @UseGuards(JwtServiceAuthGuard, RolesGuard)
    @Delete()
    async deleteSpaceById(@Req() req, @Body() deleteSpaceDto: DeleteSpaceDto){
 
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`Delete /space has been executed`);
        }
        const role = await this.spaceService.deleteSpaceById(req.user.id, deleteSpaceDto);
        return Object.assign({
            data: role ,
            statusCode: 200,
            statusMsg: 'delete space success'
        })
    }

}
