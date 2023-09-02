import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { LocalServiceStrategy } from './strategies/local-service.strategy';
import { JwtServiceStrategy } from './strategies/jwt-service.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule.register({ session: false}),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                //console.log(configService.get('SECRET_KEY'),)
                return {
                    secret: configService.get('SECRET_KEY'),
                    signOptions: { expiresIn: '1h'}
                };
            },
            inject: [ConfigService]
        }),
    ],
    providers: [AuthService, LocalServiceStrategy, JwtServiceStrategy],
    controllers: [AuthController],
    exports :[AuthService],
})
export class AuthModule {}
