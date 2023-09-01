import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ session: false}),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('SECRET_KEY'),
                    signOptions: { expiresIn: '1800s'}
                };
            },
            inject: [ConfigService]
        }),
    ],
    providers: [AuthService, LocalServiceStrategy,UserService],
    controllers:[AuthController],
})
export class AuthModule {}
