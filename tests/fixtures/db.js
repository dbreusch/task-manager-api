const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Dave Reusch",
    email: "david.reusch@nmt.edu",
    password: "abc123$$321cba",
    age: 56,
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "David Reusch PhD",
    email: "dbr120@psu.edu",
    password: "abc123$$321cba",
    age: 56,
    tokens: [{
        token: jwt.sign({
            _id: userTwoId
        }, process.env.JWT_SECRET)
    }]
}

const userThreeId = new mongoose.Types.ObjectId()
const userThree = {
    name: "David Reusch",
    email: "dbreusch@nowhere.com",
    password: "abc123$$321cba",
    age: 56,
    tokens: [{
        token: jwt.sign({
            _id: userThreeId
        }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()         // clear database
    await Task.deleteMany()
    await new User(userOne).save()  // add known users
    await new User(userTwo).save()
    await new Task(taskOne).save()  // add tasks
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    userThreeId,
    userThree,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}