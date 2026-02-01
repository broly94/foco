import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '@app/auth/services/auth.service';
import { LoginDto } from '@app/auth/dto/LoginDto';
import { AuthInterceptor } from '@app/auth/interceptors/auth.interceptor';
import { UsersService } from '@app/users/services/users.service';
import { CreateUserDto } from '@app/users/dto/CreateUserDto';
import { ErrorManager } from '@app/common/utils/error-manager';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@UseInterceptors(AuthInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('login')
  public async login(@Body() { email, password }: LoginDto) {
    const user = await this.authService.validateUser(email, password);
    return await this.authService.generateJWT(user);
  }

  @Post('register')
  public async register(@Body() user: CreateUserDto): Promise<CreateUserDto | {}> {
    return await this.usersService.createUser(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirige automáticamente a Google
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.generateJWT(req.user);
    return res.redirect(
      `http://localhost:3000?token=${jwt?.accessToken}&user_email=${jwt.userFound.email}&user_name=${jwt.userFound.name}&avatar=${jwt.userFound.avatar}&id=${jwt.userFound.id}`,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async ValidateMe(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    console.log(req.user);
    return req.user;
  }
}
