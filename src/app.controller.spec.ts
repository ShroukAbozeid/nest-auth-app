import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('redirects to home if user logged in', () => {
      const req = {
        isAuthenticated: () =>{
          return true
        }
      }
      const res = { redirect: jest.fn() }
      appController.root(req, res)
      expect(res.redirect).toHaveBeenCalledWith('home')
    });

    it('renders index if user not logged in', () => {
        const req = {
        isAuthenticated: () =>{
          return false
        },
        flash: (message: string) => {
          return message;
        }
      }
      const res = { render: jest.fn()}
      appController.root(req, res)
      expect(res.render).toHaveBeenCalledWith('index', { message: 'error'})
    });
  });

  describe('home', () => {
    it('renders home for user',async () => {
        const req = {
          user: { id: 3, name: 'Fake', email: 'fake@fake.com', emailConfirmed: true },
        isAuthenticated: () => {
          return true
        },
        flash: (message: string) => {
          return message;
        }
      }
      const res = { render: jest.fn() }
      await appController.home(req, res)
      expect(res.render).toHaveBeenCalledWith(
        'home', 
        { 
          user: { id: 3, name: 'Fake', email: 'fake@fake.com', emailConfirmed: true },
          message: 'error'
        }
      )
    });
  });
});
