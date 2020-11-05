const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const mongoose = require('mongoose')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendGoodbyeEmail } = require('../emails/account')
const router = express.Router()

// create multer object for uploads
const upload = multer({
    limits: {
        fileSize: 1000000   // size is in BYTES
    },
    fileFilter(req, file, cb) {
        // how to call callback cb
        // cb(new Error('Please choose an image')) // return error w/message
        // cb(undefined, true)                     // nothing went wrong, accept upload
        // cb(undefined, false)                    // silently reject upload

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a JPG, JPEG or PNG file'))
        }

        cb(undefined, true)
    }
})

// Create: create a new user
// generate new Auth token
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// Create: Support user login, create a new auth token for an existing user
// generate new Auth token
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // Manual approach to filtering data returned from route
        // res.send({ user: user.getPublicProfile(), token })
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// Update: Handle user logout: remove an auth token for one session
// require existing Auth token
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Update: Handle user logout: remove user's tokens for ALL sessions
// require existing Auth token
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

// Read: get my (logged in) user profile
// require existing Auth token
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Create/Update: Allow user to upload a user avatar image
//                Also updates since it just overwrites anything that was there
// require existing Auth token
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Delete: Allow user to delete a user avatar image
// require existing Auth token
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined   // clear the avatar data
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Read: Return the avatar image file for a user
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

// Update: single user
// require existing Auth token
router.patch('/users/me', auth, async (req, res) => {
    // validate requested update parameters
    const updates = Object.keys(req.body) // make array from body data
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }

    const _id = req.user.id
    try {
        // const user = await User.findById(_id)

        // if (!user) {
        //     return res.status(404).send({ error: 'User id not found' })
        // }

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete: single user
// require existing Auth token
router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id

    try {
        // const user = await User.findByIdAndDelete(_id)

        // if (!user) {
        //     return res.status(404).send()
        // }

        await req.user.remove()
        // sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
