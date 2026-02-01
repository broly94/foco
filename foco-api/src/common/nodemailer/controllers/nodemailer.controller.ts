import { ErrorManager } from '@app/common/utils/error-manager';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { NodemailerService } from '@app/common/nodemailer/services/nodemailer.service';
import { Response } from 'express';
import { UsersService } from '@app/users/services/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mailer')
@Controller('mailer')
//@UseGuards(AccessLoginGuard)
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}

  @Post('forgot-password')
  public async sendEmailforgotPassword(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const sendEmail = await this.nodemailerService.sendEmailforgotPassword(body.email);
      if (!sendEmail.messageId) throw new ErrorManager({ type: 'INTERNAL_SERVER_ERROR', message: 'Error al enviar el email' });
      return res.json({ message: 'Correo enviado con exito', error: false });
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
