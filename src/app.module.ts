import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { SpaceController } from './space/space.controller';
import { SpaceService } from './space/space.service';
import { SpaceModule } from './space/space.module';
import { SpaceroleService } from './spacerole/spacerole.service';
import { SpaceroleModule } from './spacerole/spacerole.module';
import { UserspaceService } from './userspace/userspace.service';
import { UserspaceModule } from './userspace/userspace.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: TypeormConfig
    }),
    UserModule,
    AuthModule,
    SpaceModule,
    SpaceroleModule,
    UserspaceModule
  ],
  controllers: [AppController, SpaceController],
  providers: [AppService, SpaceService, SpaceroleService, UserspaceService],
})
export class AppModule {}
