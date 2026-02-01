import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '@app/users/services/users.service';
import { ErrorManager } from '@app/common/utils/error-manager';
import { UserType } from '@app/interfaces';
import { UsersEntity } from '@app/users/entities/users.entity';
import { CreateUserDto } from '@app/users/dto/CreateUserDto';

@Injectable()
export class GoogleStrategyService extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const { id: googleId, name, emails, photos } = profile;

      let user = await this.usersService.findUserByEmail(emails[0].value, false); // tipo: UsersEntity | null

      if (!user) {
        // Crear nuevo usuario
        const newUserDto: CreateUserDto = {
          name: name.givenName,
          lastName: name.familyName,
          email: emails[0].value,
          password: null,
          googleId,
          token_access_google: null,
          phone: null,
          avatar: photos[0].value,
          numberOfStrategy: 1,
          userType: UserType.CONSUMER,
          active: true,
        };

        // Esto debe devolver un UsersEntity
        user = await this.usersService.createUser(newUserDto);
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
