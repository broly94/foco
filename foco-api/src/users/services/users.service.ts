import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@app/users/entities/users.entity';
import { CreateUserDto } from '@app/users/dto/CreateUserDto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AddressUsersService } from '@app/address_users/services/address_users.service';
import { UpdateUserDto } from '@app/users/dto/UpdateUserDto';
import { MakeAdminDto } from '@app/users/dto/MakeAdminDto';
import { NodemailerService } from '@app/common/nodemailer/services/nodemailer.service';
import { DecodedToken } from '@app/common/utils/decoded-token';
import { UserType } from '@app/interfaces';
import { ResetPasswordDto } from '@app/users/dto/ResetPasswordDto';
import { IUsersServices } from '@app/users/interfaces';

@Injectable()
export class UsersService implements IUsersServices {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @Inject(forwardRef(() => AddressUsersService))
    private readonly addressUsersService: AddressUsersService,
    @Inject(NodemailerService)
    private readonly nodemailerService: NodemailerService,
  ) {
    console.log('UsersService initialized');
  }

  public async createUser(body: CreateUserDto): Promise<UsersEntity> {
    try {
      const userByEmail = await this.usersRepository.findOneBy({ email: body.email });
      const userByPhone = await this.usersRepository.findOneBy({ phone: body.phone });

      if (userByEmail && userByEmail?.email != null) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El email ya está en uso',
        });
      } else if (userByPhone && userByPhone.phone != null) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'El celular ya está en uso',
        });
      }

      if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, Number(process.env.HAST_SALT));
      }

      body.userType = UserType.CONSUMER;
      body.active = true; // Activar automáticamente en desarrollo

      console.log(body);

      const user = await this.usersRepository.save(body);

      //Habilitar el envio de correo cuando este activo.
      //const sendEmail = await this.nodemailerService.sendEmailActivateAccount(user.id, user.email);

      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findAllUsers(): Promise<UsersEntity[]> {
    try {
      const user = await this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.address_user', 'address_user').getMany();
      if (!user) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUserByEmail(email: string, withAdress: boolean): Promise<UsersEntity> {
    try {
      const query = this.usersRepository.createQueryBuilder('user').where('user.email = :email', { email });

      if (withAdress) {
        query.leftJoinAndSelect('user.address_user', 'address_user');
      }

      const user = await query.getOne();
      return user ?? null;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async findUserById(id: number, withAdress: boolean): Promise<UsersEntity | null> {
    try {
      if (withAdress) {
        const user = await this.usersRepository
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.address_user', 'address_user')
          .where('user.id = :id', { id })
          .getOne();
        if (!user) {
          throw new ErrorManager({
            type: 'NOT_FOUND',
            message: 'Usuario no encontrado',
          });
        }
        return user;
      } else {
        const user = await this.usersRepository.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
        if (!user) {
          throw new ErrorManager({
            type: 'NOT_FOUND',
            message: 'Usuario no encontrado',
          });
        }
        return user;
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async updateUser(user: UpdateUserDto, id: number) {
    try {
      const userFound = await this.findUserById(id, false);
      if (!userFound) {
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'Usuario no encontrado' });
      }

      userFound.name = user.name;
      userFound.lastName = user.lastName;
      userFound.phone = user.phone;

      const userUpdate = await this.usersRepository.update(id, userFound);
      console.log(userUpdate);
      if (userUpdate.affected) {
        return true;
      }
    } catch (error) {
      // validateEmail(error);
      // validatePhone(error);
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async deleteUser(id: number, withAdress: boolean) {
    try {
      if (withAdress) {
        await this.addressUsersService.deleteAdressUser(id);
        await this.usersRepository.delete(id);
      } else {
        await this.usersRepository.delete(id);
      }
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async makeAdmin(user: MakeAdminDto) {
    try {
      const userFound = await this.findUserByEmail(user.email, false);
      if (!userFound) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Usuario no encontrado' });
      return await this.usersRepository.update(userFound.id, user);
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async activeAccount(token: string) {
    try {
      const { isExpired, id } = DecodedToken(token);

      if (isExpired) {
        await this.addressUsersService.deleteAdressUser(id);
        await this.usersRepository.delete(id);
        throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'El token a expirado' });
      }

      const user = await this.usersRepository.findOneBy({ id });

      if (!user.tokenActiveAccount)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Error, el token de activacion no se proporcionó a este usuario',
        });

      const isActiveAccount = await this.usersRepository.update(user.id, { active: true, tokenActiveAccount: null });

      return isActiveAccount.affected ? true : false;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async recoveryPassword(body: ResetPasswordDto) {
    try {
      const { passwordOne, passwordTwo, tokenForgotPassword } = body;
      const user = await this.usersRepository.findOneBy({ tokenForgotPassword });
      if (!user)
        throw new ErrorManager({
          type: 'INTERNAL_SERVER_ERROR',
          message: 'Token incorrecto o el usuario no existe',
        });

      if (user.tokenForgotPassword) {
        const { isExpired, id } = DecodedToken(user.tokenForgotPassword);
        if (isExpired) {
          await this.usersRepository.update(id, { tokenForgotPassword: null });
          throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'El token a expirado' });
        }
      }

      if (passwordOne !== passwordTwo) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Las contraseñas no coinciden' });
      const newPasswordEncryp = bcrypt.hashSync(passwordOne, Number(process.env.HAST_SALT));
      const userUpdate = await this.usersRepository.update(user.id, { tokenForgotPassword: null, password: newPasswordEncryp });
      if (userUpdate.affected) return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async getTokenForgotPassword(tokenForgotPassword: string) {
    try {
      const token = (await this.usersRepository.findOne({ where: { tokenForgotPassword } })).tokenForgotPassword;
      if (!token) throw new ErrorManager({ type: 'NOT_FOUND', message: 'El usuario no existe' });
      return token;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
