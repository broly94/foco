import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressUsersController } from '@app/address_users/controllers/address_users.controller';
import { AddressUsersService } from '@app/address_users/services/address_users.service';
import { AddressUserEntity } from '@app/address_users/entities/address_user.entity';
import { UsersService } from '@app/users/services/users.service';
import { NodemailerService } from '@app/common/nodemailer/services/nodemailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressUserEntity])],
  controllers: [AddressUsersController],
  providers: [AddressUsersService, UsersService, NodemailerService],
  exports: [AddressUsersService],
})
export class AddressUsersModule {}
