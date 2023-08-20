import { Controller, Post, Body, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpLoginDto } from './dto/signup-login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from 'src/decorators/public.decorator';
import { RefreshBodyFilter } from 'src/exception-filters/refresh-body.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() signUpLoginDto: SignUpLoginDto) {
    return this.authService.signup(signUpLoginDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() signUpLoginDto: SignUpLoginDto) {
    return this.authService.login(signUpLoginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseFilters(new RefreshBodyFilter())
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
