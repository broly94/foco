import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { UsersService } from '@app/users/services/users.service';
import { ErrorManager } from '@app/common/utils/error-manager';
import { UsersEntity } from '@app/users/entities/users.entity';
import { PayloadToken } from '@app/auth/interfaces';
import { DecodedToken } from '@app/common/utils/decoded-token';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersServices: UsersService,
  ) {}

  public async validateUser(email: string, password: string) {
    try {
      const user = await this.usersServices.findUserByEmail(email, false);
      if (user == null) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Usuario o contraseña incorrectos',
        });
      }
      if (user) {
        if (user.active === false) {
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'La cuenta no está activa, revisa tu correo electrónico',
          });
        }

        if (user.googleId != null && user.password == null) {
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'Inicia sesión con Google',
          });
        }

        const match = bcrypt.compareSync(password, user.password);
        if (match) {
          return user;
        } else {
          throw new ErrorManager({
            type: 'UNAUTHORIZED',
            message: 'Usuario o contraseña incorrectos',
          });
        }
      }

      return null;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async generateJWT(user: UsersEntity) {
    try {
      const userFound = await this.usersServices.findUserById(user.id, false);

      if (!userFound) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      const payloadToken: PayloadToken = {
        id: userFound.id,
        email: userFound.email,
        avatar: userFound.avatar,
        userType: userFound.userType,
      };

      return {
        accessToken: jwt.sign(payloadToken, process.env.PRIVATE_KEY_JSONWEBTOKEN_AUTH, {
          expiresIn: '30 days',
        }),
        userFound,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  @Cron('0 */30 * *  * *', { name: 'CronJobVerifiedAccounts' })
  public async CronJobVerifiedAccounts() {
    this.logger.debug('CronJob Ejecuted');
    const users: UsersEntity[] = await this.usersServices.findAllUsers();
    return users.map(async (user) => {
      if (user.tokenActiveAccount) {
        const { isExpired } = DecodedToken(user.tokenActiveAccount);
        if (isExpired) await this.usersServices.deleteUser(user.id, false);
      }
    });
  }
}
