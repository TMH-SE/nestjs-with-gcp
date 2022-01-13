import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/shared/modules/database/database.module';
import { userProviders, USER_REPOSITORY } from './user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
