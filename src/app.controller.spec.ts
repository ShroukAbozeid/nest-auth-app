import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { User } from './users/user.entity';

describe('AppController', () => {
  let appController: AppController;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, name: 'Fake', email: 'fake@fake.com', emailConfirmed: true } as User)
      }
    }
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { 
          provide: UsersService,
          useValue: usersService
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('redirects to home if user logged in', () => {
      const req = { cookies: {access_token: 'sgsg'}} ;
      const res = { redirect: jest.fn() }
      appController.root(req, res)
      expect(res.redirect).toHaveBeenCalledWith('home')
    });

    it('renders index if user not logged in', () => {
      const req = { cookies: {access_token: undefined}} ;
      const res = { render: jest.fn()}
      appController.root(req, res)
      expect(res.render).toHaveBeenCalledWith('index')
    });
  });

  describe('home', () => {
    it('renders home for user',async () => {
      const req = { user: {id: 3},cookies: {access_token: 'sgsg'}} ;
      const res = { render: jest.fn() }
      await appController.home(req, res)
      expect(res.render).toHaveBeenCalledWith('home', { user: { id: 3, name: 'Fake', email: 'fake@fake.com', emailConfirmed: true }})
    });
  });
});
