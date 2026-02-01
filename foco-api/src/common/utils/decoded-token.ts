import * as jwt from 'jsonwebtoken';
import { AuthTokenResult } from '@app/auth/interfaces';
import { UseToken } from '@app/auth/interfaces';
import { ErrorManager } from '@app/common/utils/error-manager';

export const DecodedToken = (token: string): UseToken => {
  try {
    const decode = jwt.decode(token) as AuthTokenResult;

    const currentDate = new Date();
    const expiresDate = new Date(decode.exp);

    return {
      id: decode.id,
      userType: decode.userType,
      isExpired: +expiresDate <= +currentDate / 1000,
    };
  } catch (error) {
    throw ErrorManager.createSignatureError('Error en el token proporcionado');
  }
};
