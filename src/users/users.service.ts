import { Injectable, BadRequestException, NotFoundException,
         forwardRef, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>,
              @Inject(forwardRef(() => AuthService))
               private readonly authService: AuthService){}

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

  async updateUser(userId: number, userDto: UpdateUserDto) {
    // find user
    const user = await this.findOne(userId)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    // check email uniqueness
    if(userDto.email) {
      const anotherUser = await this.findByEmail(userDto.email)
      if (anotherUser.id != userId) {
        throw new BadRequestException('Email taken!')
      }
    }
    // hash password
    if(userDto.password) {
      userDto.password = await this.authService.hashPassword(userDto.password)
    }
    // update user
    return await this.usersRepo.update({id: userId}, userDto)
  }
}
