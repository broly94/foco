import { UserType } from '@app/interfaces';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  idUser: number;
  userType: UserType;
}
