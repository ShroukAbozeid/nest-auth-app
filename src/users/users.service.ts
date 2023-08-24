import { Injectable, BadRequestException, NotFoundException,
         forwardRef, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { ResetPasswordDto } from '../auth/dtos/reset-password.dto';
import { GoogleUserDto } from '../auth/dtos/google-user.dto';

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

  createUser(userDto: CreateUserDto | GoogleUserDto) {
    const user = this.usersRepo.create(userDto)
    return this.usersRepo.save(user);
  }
  

  async updateUser(user: User, userDto: UpdateUserDto) {
    // hash password if changed
    if(userDto.password) {
      userDto.password = await this.authService.hashPassword(userDto.password)
    } else { // keep password the same
      userDto.password = user.password;
    }
    // update user
    return await this.usersRepo.update({id: user.id}, userDto)
  }

  async findAll() {
    return await this.usersRepo.find()
  }
}
