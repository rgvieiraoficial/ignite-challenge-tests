import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Statement Operation UseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    );
  });

  it('should be able to get the user statement operation using user_id and statement_id', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'fake_name',
      email: 'fake_email@mail.com',
      password: 'fake_password',
    });

    const user_id = user.id as string;

    const statement = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'fake_description_2',
    });

    const statement_id = statement.id as string;

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    });

    expect(statementOperation).toHaveProperty('id');
    expect(statementOperation.id).toEqual(statement.id);
    expect(statementOperation).toEqual(statement);
  });

  it('should not be able to get the user statement operation if the user does not exist', async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: 'fake_user_id',
        statement_id: 'fake_statement_id',
      }),
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be able to get the user statement operation if the statement does not exist', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'fake_name',
      email: 'fake_email@mail.com',
      password: 'fake_password',
    });

    const user_id = user.id as string;

    await expect(
      getStatementOperationUseCase.execute({
        user_id,
        statement_id: 'fake_statement_id',
      }),
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
