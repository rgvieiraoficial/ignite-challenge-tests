import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it('should be able to show user balance', async () => {
    const user: ICreateUserDTO = {
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    };

    const addUser = await createUserUseCase.execute(user);

    const user_id = addUser.id as string;

    const type = 'deposit' as OperationType;

    const statement: ICreateStatementDTO = {
      user_id,
      type,
      amount: 500,
      description: 'Test deposit'
    }

    await createStatementUseCase.execute(statement);

    const result = await getBalanceUseCase.execute({ user_id });

    expect(result).toHaveProperty('balance');
  });

  it('should not be able to show balance of a non-existing user', () => {
    expect(async () => {
      const user_id = '0eed4a45-883f-48dd-b265-d949785a8ca2';

      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
