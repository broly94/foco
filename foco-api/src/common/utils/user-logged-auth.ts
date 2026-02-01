import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DecodedToken } from './decoded-token';

interface UserLoggedAuthInterface {
  idUser: number;
}

export async function UserLoggedAuth(req: Request): Promise<UserLoggedAuthInterface> {
  const header = req.headers.authorization;
  if (!header) throw new UnauthorizedException('Token de autorización requerido');
  const token = header.split(' ')[1];
  if (!token) throw new UnauthorizedException('Token de autorización requerido');
  const { id: idUser, isExpired } = DecodedToken(token);
  if (isExpired) throw new UnauthorizedException('Token expirado');
  return {
    idUser,
  };
}
