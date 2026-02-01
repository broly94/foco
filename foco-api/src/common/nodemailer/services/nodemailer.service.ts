import { ErrorManager } from '@app/common/utils/error-manager';
import { Injectable } from '@nestjs/common';
import { InjectMailer, Mailer } from 'nestjs-mailer';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@app/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class NodemailerService {
  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
    @InjectMailer() private readonly mailer: Mailer,
  ) {}

  public async sendEmailforgotPassword(email: string) {
    try {
      //TODO: Retornamos el usuario que quiere recuperar la password
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) throw new ErrorManager({ type: 'NOT_FOUND', message: 'Usuario no encontrado' });
      //TODO: Se crea el token forgot password
      const tokenForgotPassword = jwt.sign({ id: user.id }, process.env.PRIVATE_KEY_JSONWEBTOKEN_RECOVERY_PASSWORD, { expiresIn: '10m' });
      //TODO: Insertamos el token creado al usuario logueado que quiere recupera la password
      await this.usersRepository.update(user.id, { tokenForgotPassword });
      //TODO: Se crea una url random para el boton de recovery password
      const urlRandom = `${uuid(tokenForgotPassword)}`;
      return await this.mailer.sendMail({
        from: '"Foco" <no-reply@focoanuncio.com>',
        to: user.email,
        subject: 'Recuperá tu contraseña',
        html: `
        <br />
        <a href="http://${process.env.SERVER_HOST}:${process.env.PORT}/forgot-password/${urlRandom}/?t=${tokenForgotPassword}">Recuperar contraseña</a>
        `,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  public async sendEmailActivateAccount(id: number, email: string) {
    try {
      const tokenActiveAccount = jwt.sign({ id, email }, process.env.PRIVATE_KEY_JSONWEBTOKEN_ACTIVE_ACCOUNT, { expiresIn: '10m' });
      await this.usersRepository.update(id, { tokenActiveAccount });
      //const urlRandom = `${uuid(tokenActiveAccount)}`;
      return await this.mailer.sendMail({
        from: '"Foco" <no-reply@focoanuncio.com>',
        to: email,
        subject: 'Activa tu cuenta',
        html: `
        <br />
        <a href="http://${process.env.SERVER_HOST}:${process.env.PORT}/active-account?t=${tokenActiveAccount}">Activa tu cuenta</a>
        `,
      });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
