import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserMeetingEntity } from 'src/usermeeting/usermeeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserMeetingEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
