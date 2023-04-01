import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDTO } from './ICreateUserDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should create a new user', async () => {
    const user: ICreateUserDTO = {
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    };

    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty('id');
  });

  it('should not be able to create a new user with existing email', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Usuário Oculto',
        email: 'hidden.user@gmail.com',
        password: '123456'
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  })
});
