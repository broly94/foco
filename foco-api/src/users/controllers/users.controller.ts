import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Put, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '@app/users/services/users.service';
import { AccessLoginGuard } from '@app/auth/guards/access-login.guard';
import { GetUsersInterceptor } from '@app/users/interceptors/get-user-s.interceptor';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AccessAdminDecorator } from '@app/common/decorators/access-admin.decorator';
import { UpdateUserDto } from '@app/users/dto/UpdateUserDto';
import { MakeAdminDto } from '@app/users/dto/MakeAdminDto';
import { AccessPublicDecorator } from '@app/common/decorators/access-public.decorator';
import { ResetPasswordDto } from '@app/users/dto/ResetPasswordDto';
import { UsersEntity } from '@app/users/entities/users.entity';
import { RequestWithUser } from '@app/common/interfaces/request-with-user.interface';

@ApiTags('Users')
@Controller('users')
@UseGuards(AccessLoginGuard)
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  // TODO: Uso personal
  @UseInterceptors(new GetUsersInterceptor())
  @AccessAdminDecorator()
  @Get('all')
  public async getAllUsers(): Promise<UsersEntity[]> {
    try {
      return await this.usersServices.findAllUsers();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @UseInterceptors(new GetUsersInterceptor())
  // ?: Uso personal
  @AccessAdminDecorator()
  @Get('user-by-email')
  public async getUserByEmail(@Query('email') email: string): Promise<UsersEntity> {
    try {
      return await this.usersServices.findUserByEmail(email, true);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  //TODO: Devuelve el perfil del usuario logueado
  @UseInterceptors(new GetUsersInterceptor())
  @Get('profile')
  public async getUserById(@Req() request: RequestWithUser): Promise<UsersEntity> {
    const id = request.idUser;
    try {
      return await this.usersServices.findUserById(id, true);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Put('edit-profile')
  public async updateUser(@Body() user: UpdateUserDto, @Req() request: RequestWithUser, @Res() res: Response): Promise<any> {
    try {
      const userResponse = await this.usersServices.updateUser(user, request.idUser);
      if (userResponse) res.json({ message: 'Usuario editado correctamente', error: false });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @AccessAdminDecorator()
  @Put('make-admin')
  public async makeAdmin(@Body() user: MakeAdminDto, @Res() res: Response): Promise<any> {
    try {
      const makeAdmin = await this.usersServices.makeAdmin(user);
      if (makeAdmin) res.json({ message: `Tipo de usuario editado correctamente para: ${user.email}`, error: false });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @AccessPublicDecorator()
  @Put('activation-account')
  public async activationAccount(@Body() body: { token: string }, @Res() res: Response) {
    try {
      const isActive = await this.usersServices.activeAccount(body.token);
      console.log(isActive);
      if (!isActive) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al activar la cuenta' });
      res.json({
        message: 'Cuenta activada correctamente',
        error: true,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Post('recovery-password')
  public async recoveryPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    try {
      const isRecoveryPassword = await this.usersServices.recoveryPassword(body);
      if (!isRecoveryPassword) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al recuperar su contraseña' });
      res.json({ message: 'Contraseña recuperada con exito', error: false });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
