import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {JsonWebTokenError} from 'jsonwebtoken'
import { GoogleUserDto } from './dtos/google-user.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>
  let mailerService: Partial<MailerService>

  beforeEach(async () => {
    const users: User[] =[]
    usersService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers[0]);
      },
      createUser: (userDto: CreateUserDto| GoogleUserDto) => {
        let user = { 
          id: Math.floor(Math.random()*  999999), 
          email: userDto.email,
          name: userDto.name,
        } as User;
        if(userDto instanceof CreateUserDto){
          user.password = userDto.password
        } else {
          user.provider = userDto.provider
          user.providerId = userDto.providerId
        }
        users.push(user)
        return Promise.resolve(JSON.parse(JSON.stringify(user)))
      }
    }

    mailerService = {
      sendConfirmationMail: jest.fn(),
      sendForgetPasswordMail: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async(configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {expiresIn: '1d'}
          })
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService
        },
        {
          provide: MailerService,
          useValue: mailerService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates new user and send confirmation email', async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    const user = await service.createUser(userDto)
    expect(user).toBeDefined();
    expect(user.email).toEqual('fake@fake.com')
    expect(user.password).toBeUndefined()
    expect(user.name).toEqual('FAKE')
    expect(mailerService.sendConfirmationMail).toHaveBeenCalledWith('fake@fake.com',  'FAKE')
  })

  it('throws an error if user signs up with email that is in use', async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    await service.createUser(userDto)
    await expect(service.createUser(userDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns user if password is correct', async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    const user = await service.createUser(userDto)
    const returnedUser = await service.validateUser(userDto.email, 'Fake@1223')
    expect(returnedUser).toEqual(user)
  })

  it('returns null if password is wrong', async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    const user = await service.createUser(userDto)
    const returnedUser = await service.validateUser(userDto.email, 'Fake')
    expect(returnedUser).toBeNull()
  })

  it('returns null if email is not found', async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    const user = await service.createUser(userDto)
    const returnedUser = await service.validateUser('hello@fake.com', 'Fake@1223')
    expect(returnedUser).toBeNull()
  })

  it('returns email from email_confirmation token',async () => {
    const token = service.generateConfirmEmailToken('fake@fake.com'); 
    expect(await service.findEmailFromToken(token, 'email_confirmation')).toEqual('fake@fake.com')
  })

  it('throws an error if invalid email_confirmation token', async () => {
    await expect(service.findEmailFromToken('hfdfh', 'email_confirmation')).rejects.toThrow(
      JsonWebTokenError,
    );
  });

  it('returns email from reset_password token',async () => {
    const token = service.generateResetPasswordToken('fake@fake.com'); 
    expect(await service.findEmailFromToken(token, 'password')).toEqual('fake@fake.com')
  })

  it('throws an error if invalid reset_password token', async () => {
    await expect(service.findEmailFromToken('hfdfh', 'reset_password')).rejects.toThrow(
      JsonWebTokenError,
    );
  });

  it('sends forget password email',async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    await service.createUser(userDto)
    await service.forgetPassword('fake@fake.com')
    expect(mailerService.sendForgetPasswordMail).toHaveBeenCalledWith('fake@fake.com', 'FAKE')
  })

  it('sends throws error if forget password for non registered email',async () => {
    await expect(service.forgetPassword('fake@fake.com')).rejects.toThrow(
      NotFoundException
    );
  })

  it('returns user if exists when login by google',async () => {
    const userDto = new GoogleUserDto()
    Object.assign(userDto, { providerId: '1234243', email: 'fake@fake.com', provider: 'google', name: 'FAKE', emailConfirmed: true})
    const user = await usersService.createUser(userDto)
    expect(await service.googleLogin(userDto)).toEqual(user)
  })

  it('create news user if doenst exists when login by google',async () => {
    const userDto = new GoogleUserDto()
    Object.assign(userDto, { providerId: '1234243', email: 'fake@fake.com', provider: 'google', name: 'FAKE', emailConfirmed: true})
    await service.googleLogin(userDto)
    const user = await usersService.findByEmail('fake@fake.com')
    expect(user.provider).toEqual('google')
  })

  it('throws error if user registered by email when login by google',async () => {
    const userDto = new CreateUserDto()
    Object.assign(userDto, { email: 'fake@fake.com', password: 'Fake@1223', name: 'FAKE'})
    await service.createUser(userDto)
    await expect(service.googleLogin({ providerId: '1234243', email: 'fake@fake.com', provider: 'google', name: 'FAKE', emailConfirmed: true})).rejects.toThrow(
      BadRequestException
    )
  })
});
