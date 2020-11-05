const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    "name": "David Reusch PhD",
    "email": "david.reusch@nmt.edu",
    "password": "abc123$$321cba",
    "age": 56
}

const userTwo = {
    "name": "David Reusch PhD",
    "email": "david.reusch@nmt.edu",
    "password": "wrong$$credentials",
    "age": 56
}

beforeEach( async () => {
    await User.deleteMany()         // clear database
    await new User(userOne).save()  // add a known user
})

// test('Should signup a new user', async () => {
//     await request(app).post('/users').send({
//         "name": "Dave Reusch",
//         "email": "dbr120@psu.edu",
//         "password": "abc123$$321cba",
//         "age": 56
//     }).expect(201)
// })

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userTwo.email,
        password: userTwo.password
    }).expect(400)
})
