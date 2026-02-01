import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class GetUsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response.map((user) => this.mapUser(user));
        } else {
          return this.mapUser(response);
        }
      }),
    );
  }

  private mapUser(user) {
    const mappedUser = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      subscription: user.subscription,
      phone: user.phone,
      avatar: user.avatar,
      user_type: user.userType,
      number_of_strategy: user.numberOfStrategy,
      adress_user: {},
    };

    if (user.adress_user) {
      mappedUser.adress_user = {
        lat: user.adress_user.lat,
        lon: user.adress_user.lon,
        country: user.adress_user.country,
        state: user.adress_user.state,
        town: user.adress_user.town,
        adress: user.adress_user.adress,
        post_code: user.adress_user.post_code,
      };
    }

    return mappedUser;
  }
}
