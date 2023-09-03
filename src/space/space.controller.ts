import { Body, Controller, Delete, Get, Logger, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceService } from './space.service';
import { CreateSpaceParamDto } from './dto/create-param.dto';
import { JoinSpaceDto } from './dto/join-space.dto';

@Controller('space')
export class SpaceController {
    private readonly logger = new Logger(SpaceController.name);
    constructor(private readonly spaceService: SpaceService){}

    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async createSpace(@Req() req, @Body() createSpaceParamDto: CreateSpaceParamDto){
        this.logger.log(`POST /space has been executed`);
        await this.spaceService.createSpace(req.user.id, createSpaceParamDto);
        return Object.assign({
            statusCode: 200,
            statusMsg: 'create space'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @Get('myspace')
    async getMyprofile(@Req() req){
        this.logger.log(`GET /space/myspace has been executed`);
        const space = await this.spaceService.getMySpace(req.user.id);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'get my space'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post('join')
    async joinSpace(@Req() req, @Body() joinSpaceDto: JoinSpaceDto){
        this.logger.log(`POST /space/join has been executed`);
        const space = await this.spaceService.joinSpace(req.user.id, joinSpaceDto);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'join space'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @Get(':joincode')
    async getJoincodeInfo(@Req() req, @Param('joincode') joincode: string){
        this.logger.log(`GET /space/${joincode} has been executed`);
        const space = await this.spaceService.getJoincodeInfo(req.user.id, joincode);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'get joincode Info'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @Delete('role/:id')
    async deleteRoleById(@Req() req, @Param('id') role_id: number){
        this.logger.log(`DELETE /space/role/${role_id} has been executed`);
        const role = await this.spaceService.deleteRoleById(role_id);
        return Object.assign({
            data: role ,
            statusCode: 200,
            statusMsg: 'delete role success'
        })
    }

    @UseGuards(JwtServiceAuthGuard)
    @Delete(':id')
    async deleteSpaceById(@Req() req, @Param('id') space_id: number){
        this.logger.log(`DELETE /space/${space_id} has been executed`);
        const role = await this.spaceService.deleteSpaceById(space_id);
        return Object.assign({
            data: role ,
            statusCode: 200,
            statusMsg: 'delete space success'
        })
    }

}
