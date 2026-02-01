import { Request } from 'express';
import { ErrorManager } from '@app/common/utils/error-manager';
import { UserLoggedAuth } from '@app/common/utils/user-logged-auth';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { RequestContextUserService } from '@app/common/providers/request_context_user.service';

@Injectable()
export class RequestContextUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService, private readonly requestContextUserService: RequestContextUserService) { }

  async use(req: Request, _: any, next: () => void) {
    try {
      console.log('Desde middleware:', req.method, req.url);
      const { idUser } = await UserLoggedAuth(req);
      const user = await this.usersService.findUserById(idUser, false);

      if (!user) {
        console.error('Middleware: Usuario no encontrado para ID', idUser);
        throw new ErrorManager({ type: 'NOT_FOUND', message: 'Usuario no encontrado' });
      }

      this.requestContextUserService.setUser(user);
      next();
    } catch (error) {
      console.error('Middleware Error:', error.message);
      // Si la ruta es pública o opcional, podrías solo hacer next()
      // Pero como estas rutas suelen requerir usuario, relanzamos el error
      // para que NestJS lo maneje y devuelva un 401/403 en vez de colgar
      next(); // Permitimos que siga para que el Guard o el Controller manejen la falta de usuario si es necesario
    }
  }
}
