import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';

import createConnection from '../../../../database';

let connection: Connection;

describe('Create Statement', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to deposit an amount to user account', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 300,
      description: 'Test deposit'
    }).set({
      Authorization: `Bearer ${token}`
    });;

    expect(response.status).toBe(201);
    expect(response.body.amount).toEqual(300);
  });

  it('should be able to withdraw any available amount', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 100,
      description: 'Test withdraw'
    }).set({
      Authorization: `Bearer ${token}`
    });;

    expect(response.status).toBe(201);
    expect(response.body.amount).toEqual(100);
  });

  it('should not be able to withdraw an amount with insufficient funds', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 2500,
      description: 'Test withdraw'
    }).set({
      Authorization: `Bearer ${token}`
    });;

    expect(response.status).toBe(400);
  });
});
