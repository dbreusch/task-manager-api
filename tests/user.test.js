const request = require('supertest')
const app = require('../src/app')

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        "name": "Dave Reusch",
        "email": "david.reusch@nmt.edu",
        "password": "abc123$$321cba",
        "age": 56
    }).expect(201)
})