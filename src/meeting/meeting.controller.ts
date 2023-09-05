import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { MeetingService } from './meeting.service';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { RolesGuard } from 'src/auth/guards/role-service.guard';
import { CreateMeetingParamDto } from './dto/create-param.dto';
import { JoinMeetingDto } from './dto/join-meeting.dto';
import { DeleteMeetingDto } from './dto/delete-meeting.dto';

@Controller('meeting')
export class MeetingController {
    private readonly logger = new Logger(MeetingController.name);
    constructor(private readonly meetingService: MeetingService){}

    // 공간 생성
    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    async createMeeting(@Req() req, @Body() createMeetingParamDto: CreateMeetingParamDto){
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`POST /meeting has been executed`);
          }
        await this.meetingService.createMeeting(req.user.id, createMeetingParamDto);
        return Object.assign({
            statusCode: 200,
            statusMsg: 'create meeting'
        })
    }

    // 내가 속한 공간정보
    @UseGuards(JwtServiceAuthGuard)
    @Get('mymeeting')
    async getMyprofile(@Req() req){
        
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`GET /meeting/mymeeting has been executed`);
        }
        const meeting = await this.meetingService.getMyMeeting(req.user.id);
        return Object.assign({
            data: meeting ,
            statusCode: 200,
            statusMsg: 'get my meeting'
        })
    }

    // 공간 참여
    @UseGuards(JwtServiceAuthGuard)
    @UsePipes(ValidationPipe)
    @Post('join')
    async joinMeeting(@Req() req, @Body() joinMeetingDto: JoinMeetingDto){
        
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`POST /meeting/join has been executed`);
        }
        const meeting = await this.meetingService.joinMeeting(req.user.id, joinMeetingDto);
        return Object.assign({
            data: meeting ,
            statusCode: 200,
            statusMsg: 'join meeting'
        })
    }

    // 참여코드로 공간정보 가져오기
    @UseGuards(JwtServiceAuthGuard)
    @Get(':joincode')
    async getJoincodeInfo(@Req() req, @Param('joincode') joincode: string){

        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`GET /meeting/${joincode} has been executed`);
        }
        const meeting = await this.meetingService.getJoincodeInfo(req.user.id, joincode);
        return Object.assign({
            data: meeting ,
            statusCode: 200,
            statusMsg: 'get joincode Info'
        })
    }

    // 공간 역할 삭제
    @UseGuards(JwtServiceAuthGuard, RolesGuard)
    @Delete('role')
    async deleteRoleById(@Req() req, @Body() deleteRoleDto: DeleteRoleDto){

        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`PUT /meeting/role has been executed`);
        }
        const role = await this.meetingService.deleteRoleById(req.user.id, deleteRoleDto);
        return Object.assign({
            data: role ,
            statusCode: 200,
            statusMsg: 'delete role success'
        })
    }

    // 공간 삭제
    @UseGuards(JwtServiceAuthGuard, RolesGuard)
    @Delete()
    async deleteMeetingById(@Req() req, @Body() deleteMeetingDto: DeleteMeetingDto){
 
        if (process.env.NODE_ENV === 'dev') {
            this.logger.log(`Delete /meeting has been executed`);
        }
        const role = await this.meetingService.deleteMeetingById(req.user.id, deleteMeetingDto);
        return Object.assign({
            data: role ,
            statusCode: 200,
            statusMsg: 'delete meeting success'
        })
    }

}
