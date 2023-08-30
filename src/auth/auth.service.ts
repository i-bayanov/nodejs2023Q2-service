import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';

import { SignUpLoginDto } from './dto/signup-login.dto';
import { RefreshDto } from './dto/refresh.dto';

import { User } from 'src/user/entities/user.entity';

import {
  cryptSault,
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpire,
  refreshTokenExpire,
} from 'src/env';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  private async checkUserExistence(signUpLoginDto: SignUpLoginDto) {
    const { login } = signUpLoginDto;
    const user = await this.usersRepository.findOneBy({ login });

    if (user) throw new ConflictException(`User ${signUpLoginDto.login} already exists`);
  }

  private async findUser(login: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ login });
    if (!user) throw new ForbiddenException('User not found');

    return user;
  }

  async signup(signUpLoginDto: SignUpLoginDto) {
    await this.checkUserExistence(signUpLoginDto);

    const { login, password } = signUpLoginDto;
    const passwordHash = await hash(password, cryptSault);
    const now = new Date().toDateString();
    const createdAt = now;
    const updatedAt = now;
    const version = 1;
    const newUser = { login, password: passwordHash, createdAt, updatedAt, version };

    const createdUser = this.usersRepository.create(newUser);

    return (await this.usersRepository.save(createdUser)).toResponse();
  }

  async login(signUpLoginDto: SignUpLoginDto) {
    const { login, password } = signUpLoginDto;
    const user = await this.findUser(login);
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) throw new ForbiddenException('Wrong login password pair');

    const { id, createdAt, updatedAt, version } = user;

    const payload: JWTPayload = { sub: id, userName: login, createdAt, updatedAt, version };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpire,
      secret: accessTokenSecret,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpire,
      secret: refreshTokenSecret,
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    try {
      const oldPayload = await this.jwtService.verifyAsync<JWTPayload>(refreshToken, {
        secret: refreshTokenSecret,
      });
      const { sub, userName, createdAt, updatedAt, version } = oldPayload;
      const payload: JWTPayload = { sub, userName, createdAt, updatedAt, version };
      const newAccessToken = await this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpire,
        secret: accessTokenSecret,
      });
      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpire,
        secret: refreshTokenSecret,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('Refresh token is invalid');
    }
  }
}
