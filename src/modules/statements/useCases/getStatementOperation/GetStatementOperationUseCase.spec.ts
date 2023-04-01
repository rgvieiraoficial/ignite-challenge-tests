import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
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

describe('Get Statement Operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('shout be able to show an operation in detail', async () => {
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

    const addStatement = await createStatementUseCase.execute(statement);

    const statement_id = addStatement.id as string;

    const result = await getStatementOperationUseCase.execute({ user_id, statement_id });

    expect(result).toHaveProperty('amount')
  });

  it('shout not be able to show an operation in detail of a non-existing user', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Usuário Oculto',
        email: 'hidden.user@gmail.com',
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

      const addStatement = await createStatementUseCase.execute(statement);

      const statement_id = addStatement.id as string;

      await getStatementOperationUseCase.execute({ user_id: 'invalid id', statement_id });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('shout not be able to show an operation in detail with invalid id', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Usuário Oculto',
        email: 'hidden.user@gmail.com',
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

      const addStatement = await createStatementUseCase.execute(statement);

      const statement_id = 'invalid id';

      await getStatementOperationUseCase.execute({ user_id, statement_id });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
