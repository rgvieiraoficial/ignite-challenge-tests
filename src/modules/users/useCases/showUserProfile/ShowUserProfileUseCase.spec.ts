import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  });

  it('should be able to show an user profile', async () => {
    const user: ICreateUserDTO = {
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo@ferrundes@gmail.com',
      password: '123456'
    };

    const addUser = await createUserUseCase.execute(user);

    const user_id = addUser.id as string;

    const result = await showUserProfileUseCase.execute(user_id);

    expect(result).toHaveProperty('id');
  });

  it('should not be able to show a non-existing user', () => {
    expect(async () => {
      const user_id = 'e0bca861-8fc4-47ef-80e8-0a9f01bb2fdc';

      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
