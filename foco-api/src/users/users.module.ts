import { TypeOrmModule } from '@nestjs/typeorm';
import { Global, Module, forwardRef } from '@nestjs/common';
import { UsersController } from '@app/users/controllers/users.controller';
import { UsersService } from '@app/users/services/users.service';
import { UsersEntity } from '@app/users/entities/users.entity';
import { AddressUsersModule } from '@app/address_users/address_users.module';
import { NodemailerService } from '@app/common/nodemailer/services/nodemailer.service';

//TODO: Se pone el modulo como global por que el access login utiliza a users, eso hace que cuando se use el guard de access login, estos modulos usen a users module.
//TODO: Para no tener que importar usersModule en todos los modules donde usan este guard, se hace este modulo global.
@Global()
@Module({
  imports: [forwardRef(() => AddressUsersModule), TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, NodemailerService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
