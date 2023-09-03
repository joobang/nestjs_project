import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SpaceEntity } from 'src/space/space.entity';
import { UserSpaceEntity } from 'src/userSpace/userspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SpaceEntity, UserSpaceEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
