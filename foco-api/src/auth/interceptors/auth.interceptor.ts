import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response?.accessToken) {
          const { userFound, accessToken } = response;
          return {
            id: userFound.id,
            name: userFound.name,
            lastName: userFound.lastName,
            email: userFound.email,
            phone: userFound.phone,
            avatar: userFound.avatar,
            subscription: userFound.subscription,
            address_user: userFound.address_user,
            token: accessToken,
          };
        } else {
          return {
            id: response?.id,
            name: response?.name,
            lastName: response?.lastName,
            email: response?.email,
            phone: response?.phone,
            avatar: response?.avatar,
            subscription: response?.subscription,
            address_user: response?.address_user,
          };
        }
      }),
    );
  }
}
