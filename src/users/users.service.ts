import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>,){}

  async findOne(userId: number): Promise<User | undefined> {
    return await this.usersRepo.findOneBy({ id: userId})
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepo.findOneBy({ email: email})
  }

  createUser(userDto: CreateUserDto) {
    const user = this.usersRepo.create(userDto)
    return this.usersRepo.save(user);
  }
}
