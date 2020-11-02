const mongoose = require('mongoose')
const validator = require('validator')

// --- Task code
// set up the Task Model
// done in two steps so that additional mongoose Schema features can be used

// start by creating a Schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'         // link Task model to User model
    }
}, {    // schema options
    timestamps: true
})

// now create the Model using the Schema
const Task = mongoose.model('Task', taskSchema)

module.exports = Task