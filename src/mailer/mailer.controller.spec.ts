import { Test, TestingModule } from '@nestjs/testing';
import { MailerController } from './mailer.controller';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { MailerService } from './mailer.service';
describe('MailerController', () => {

  let controller: MailerController;
  let usersService: Partial<UsersService>;
  let authService: Partial<AuthService>;
  let mailerService: Partial<MailerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailerController],
      providers: [
        { 
          provide: MailerService,
          useValue: mailerService
        },
        { 
          provide: UsersService,
          useValue: usersService
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    }).compile();

    controller = module.get<MailerController>(MailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
