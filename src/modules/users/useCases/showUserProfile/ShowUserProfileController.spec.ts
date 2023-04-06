import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '../../../../app';

import createConnection from '../../../../database';

let connection: Connection;

describe('Show User Profile', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show an user profile', async () => {
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

    const response = await request(app).get('/api/v1/profile').set({
      Authorization: `Bearer ${token}`
    });;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
