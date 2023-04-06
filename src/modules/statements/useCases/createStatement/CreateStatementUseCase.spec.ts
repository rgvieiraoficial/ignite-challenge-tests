import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { ICreateStatementDTO } from './ICreateStatementDTO';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able to deposit an amount to user account', async () => {
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

    const result = await createStatementUseCase.execute(statement);

    expect(result.amount).toBe(500);
  });

  it('should be able to withdraw any available amount', async () => {
    const user: ICreateUserDTO = {
      name: 'Ferronido da Silva',
      email: 'ferronildo.silva@gmail.com',
      password: '123456'
    };

    const addUser = await createUserUseCase.execute(user);

    const user_id = addUser.id as string;

    const typeDeposit = 'deposit' as OperationType;

    const depositOperation: ICreateStatementDTO = {
      user_id,
      type: typeDeposit,
      amount: 500,
      description: 'Test deposit'
    }

    await createStatementUseCase.execute(depositOperation);

    const typeWithdraw = 'withdraw' as OperationType;

    const withdrawOperation: ICreateStatementDTO = {
      user_id,
      type: typeWithdraw,
      amount: 300,
      description: 'Test withdraw'
    };

    const result = await createStatementUseCase.execute(withdrawOperation);

    expect(result.amount).toBe(300);
  });

  it('should not be able to do an operation to non-existing user', () => {
    expect(async () => {
      const user_id = 'a3a2440c-90a6-4da7-a055-e1d77836a402';

      const type = 'deposit' as OperationType;

      const statement: ICreateStatementDTO = {
        user_id,
        type,
        amount: 500,
        description: 'Test deposit'
      }

      const result = await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to withdraw an amount with insufficient funds', () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Usuário Oculto',
        email: 'hidden.user@gmail.com',
        password: '123456'
      };

      const addUser = await createUserUseCase.execute(user);

      const user_id = addUser.id as string;

      const typeWithdraw = 'withdraw' as OperationType;

      const withdrawOperation: ICreateStatementDTO = {
        user_id,
        type: typeWithdraw,
        amount: 800,
        description: 'Test withdraw'
      };

      await createStatementUseCase.execute(withdrawOperation);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
