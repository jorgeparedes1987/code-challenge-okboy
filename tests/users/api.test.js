require('dotenv').config();
let request = require('supertest');
request = request('http://localhost:8081');
var token;
describe('Users test suite', () => {
  beforeAll(async() => {
    const response = await request.post(`/api/auth/login`)
    .send({
      email: process.env.email,
      password: process.env.password
    })
    .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  it('Get Users', async() => {
    const response = await request.get(`/api/user/list?page=1`)
    .set('Authorization', `JWT ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
  });

  it('Create a User', async() => {
    const response = await request
      .post(`/api/user`)
      .set('Authorization', `JWT ${token}`)
      .send({
        name: 'test_0', 
        email: 'test@test.com', 
        permissions: 'write'
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.any(Object));
  });

  it('Update a User', async() => {
    const response = await request
      .put(`/api/user/3`)
      .set('Authorization', `JWT ${token}`)
      .send({name: 'test_1', permissions: 'read'
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });
});