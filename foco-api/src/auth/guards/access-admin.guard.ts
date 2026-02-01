import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ADMIN_KEY, PUBLIC_KEY } from '@app/constans/key-decorators';
import { DecodedToken } from '@app/common/utils/decoded-token';
import { UseToken } from '@app/auth/interfaces';
import { UsersService } from '@app/users/services/users.service';

@Injectable()
export class AccessAdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService, private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

    const isAdmin = this.reflector.get<boolean>(ADMIN_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    if (!isAdmin) {
      throw new UnauthorizedException('No tienes permisos para realizar esta acción');
    }

    const req = context.switchToHttp().getRequest<Request>();

    const header = req.headers.authorization;
    if (!header) {
      throw new UnauthorizedException('No tienes acceso a esta información, debe proporcionar un token de autorización');
    }
    const token = header.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No tienes acceso a esta información, debe proporcionar un token de autorización');
    }

    const manageToken: UseToken = DecodedToken(token);

    if (manageToken.isExpired) {
      throw new UnauthorizedException('El token ah expirado');
    }

    const { id } = manageToken;

    const userLogin = await this.usersService.findUserById(id, false);

    if (userLogin.userType != 'ADMIN') {
      throw new UnauthorizedException('No tienes permisos para realizar esta acción');
    }

    return true;
  }
}
