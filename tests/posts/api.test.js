require('dotenv').config();
let request = require('supertest');
request = request('http://localhost:8081');
var token;
describe('Posts test suite', () => {
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

  it('Get Posts', async() => {
    const response = await request.get(`/api/post/list?page=1`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([expect.any(Object)]));
  });

  it('Create a Post', async() => {
    const response = await request
      .post(`/api/post`)
      .set('Authorization', `JWT ${token}`)
      .send({title: "testing", 
        content: "This is a test 3", 
        userId: 2
      })
      .set('Accept', 'application/json');
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(expect.any(Object));
  });

  it('Update a Post', async() => {
    const response = await request
      .put(`/api/post/2`)
      .set('Authorization', `JWT ${token}`)
      .send({title: "testing 123", 
        content: "This is a test 123", 
        userId: 2
      })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });
});