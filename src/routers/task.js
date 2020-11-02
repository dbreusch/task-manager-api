const express = require('express')
const mongoose = require('mongoose')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = express.Router()

// Create: task
// require existing Auth token
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    // add owner info to the new Task object
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Read: all tasks
// require existing Auth token
// filter with query string option
//   GET /tasks?completed=true|false
// paginate with query string options
//   GET /tasks?limit=nn&skip=mm
// sort with query string option
//   GET /tasks?sortBy=field_asc|desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate('tasks').execPopulate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Read: single task
// require existing Auth token
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    if (!mongoose.isValidObjectId(_id)) {
        return res.status(404).send({ error: 'Invalid task id' })
    }

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task id not found' })
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Update: single task
// require existing Auth token
router.patch('/tasks/:id', auth, async (req, res) => {
    // validate requested update parameters
    const updates = Object.keys(req.body) // make array from body data
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task id not found' })
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete: single task
// require existing Auth token
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
