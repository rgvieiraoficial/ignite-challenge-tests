import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';

import createConnection from '../../../../database';

let connection: Connection;

describe('Authenticate User', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to authenticate an user', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Glodobaldo Ferrundes',
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'glodobaldo.ferrundes@gmail.com',
      password: '123456'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate an user with invalid email', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'invalid.email@gmail.com',
      password: '123456'
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to authenticate an user with invalid password', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'glodobaldo.ferrundes@gmail.com',
      password: 'incorrect password'
    });

    expect(response.status).toBe(401);
  });
});
