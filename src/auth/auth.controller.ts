import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpLoginDto } from './dto/signup-login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpLoginDto: SignUpLoginDto) {
    return this.authService.signup(signUpLoginDto);
  }

  @Post('login')
  login(@Body() signUpLoginDto: SignUpLoginDto) {
    return this.authService.login(signUpLoginDto);
  }

  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
