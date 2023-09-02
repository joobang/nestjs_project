import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { JwtServiceAuthGuard } from 'src/auth/guards/jwt-service.guard';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceService } from './space.service';

@Controller('space')
export class SpaceController {
    private readonly logger = new Logger(SpaceController.name);
    constructor(private readonly spaceService: SpaceService){}

    @UseGuards(JwtServiceAuthGuard)
    @Post()
    async createSpace(@Body() createSpaceDto: CreateSpaceDto){
        
        return
    }
}
