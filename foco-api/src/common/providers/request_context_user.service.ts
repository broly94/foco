import { UsersEntity } from '@app/users/entities/users.entity';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextUserService {
  private user: UsersEntity;

  setUser(user: UsersEntity) {
    this.user = user;
  }

  getUser(): UsersEntity {
    return this.user;
  }
}
