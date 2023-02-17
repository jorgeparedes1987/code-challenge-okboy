require('dotenv').config();
let request = require('supertest');
request = request('http://localhost:8081');
var token;
describe('Reviews test suite', () => {

  it('Get Reviews', async() => {
    const response = await request.post(`/api/review`)      
    .send({postId: 3, 
      rate: 5
    })
    .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Object));
  });
});