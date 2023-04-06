import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';

import createConnection from '../../../../database';

let connection: Connection;

describe('Get Statement', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show a specific statement', async () => {
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

    const statementOperation = await request(app).post('/api/v1/statements/deposit').send({
      amount: 300,
      description: 'Test deposit'
    }).set({
      Authorization: `Bearer ${token}`
    });;

    const { id } = statementOperation.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);
  });

  it('should be able to show a specific statement with invalid id', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    const { token } = responseToken.body;

    const id = '0333bf07-df89-4b07-ae78-e64fe6a5dcba';

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(404);
  });
});
