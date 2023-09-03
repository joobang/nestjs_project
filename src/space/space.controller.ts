import { Body, Controller, Get, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceService } from './space.service';
import { CreateSpaceParamDto } from './dto/create-param.dto';

@Controller('space')
export class SpaceController {
    private readonly logger = new Logger(SpaceController.name);
    constructor(private readonly spaceService: SpaceService){}

    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async createSpace(@Req() req, @Body() createSpaceParamDto: CreateSpaceParamDto){
        this.logger.log(`POST /space has been executed`);
        return await this.spaceService.createSpace(req.user.id, createSpaceParamDto);
    }

    @UseGuards(JwtServiceAuthGuard)
    @Get('myspace')
    async getMyprofile(@Req() req){
        this.logger.log(`GET /user/myprofile has been executed`);
        const space = await this.spaceService.getMySpace(req.user.id);
        return Object.assign({
            data: space ,
            statusCode: 200,
            statusMsg: 'get my space'
        })
    }

}
