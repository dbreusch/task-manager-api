const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

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

const setupDatabase = async () => {
    await User.deleteMany()         // clear database
    await new User(userOne).save()  // add a known user
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase
}