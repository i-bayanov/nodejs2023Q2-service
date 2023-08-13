import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async checkUserExistence(createUserDto: CreateUserDto) {
    const { login } = createUserDto;
    const user = await this.usersRepository.findOneBy({ login });

    if (user) throw new ConflictException(`User ${createUserDto.login} already exists`);
  }

  private async findUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExistence(createUserDto);

    const { login, password } = createUserDto;
    const now = new Date().toDateString();
    const createdAt = now;
    const updatedAt = now;
    const version = 1;
    const newUser = { login, password, createdAt, updatedAt, version };

    const createdUser = this.usersRepository.create(newUser);

    return (await this.usersRepository.save(createdUser)).toResponse();
  }

  async findAll() {
    return (await this.usersRepository.find()).map((user) => user.toResponse());
  }

  async findOne(id: string) {
    return (await this.findUser(id)).toResponse();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUser(id);

    if (user.password !== updateUserDto.oldPassword)
      throw new ForbiddenException('Wrong old password');

    Object.assign(user, {
      password: updateUserDto.newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    });

    return (await this.usersRepository.save(user)).toResponse();
  }

  async remove(id: string) {
    const deleteResult = await this.usersRepository.delete(id);

    if (!deleteResult.affected) throw new NotFoundException('User not found');
  }
}
