const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const tasks = response.body
    expect(tasks.length).toEqual(2)
})

test('Should not delete other user task', async () => {
    const taskID = taskOne._id
    const response = await request(app)
        .delete(`/tasks/${taskID}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task = await Task.findById(taskID)
    expect(task).not.toBeNull()
})