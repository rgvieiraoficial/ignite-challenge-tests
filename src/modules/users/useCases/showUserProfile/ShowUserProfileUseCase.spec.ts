import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileError } from './ShowUserProfileError';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;

let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show user profile by user_id', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'fake_name',
      email: 'fake_email@mail.com',
      password: '123456',
    });

    const user_id = user.id as string;

    const response = await showUserProfileUseCase.execute(user_id);

    expect(response).toEqual(user);
  });

  it('should be able to show user profile by user_id if the user does not exist', async () => {
    await expect(
      showUserProfileUseCase.execute('non_existent_id'),
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
