import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent use', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@gmail.com',
        password: '1234'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate a user with incorrect email', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Glodobaldo Ferrundes',
        email: 'glodobaldo.ferrundes@gmail.com',
        password: '123456'
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: 'incorrect@gmail.com',
        password: user.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate a user with incorrect password', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Glodobaldo Ferrundes',
        email: 'glodobaldo.ferrundes@gmail.com',
        password: '123456'
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrect'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
