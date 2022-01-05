const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

const router = new express.Router()


// Create new user
router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
        console.log('Error creating user \n' + error)
    }
})


//Login User
router.post('/users/login', async (req, res) => {

    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })

    } catch (error) {
        res.status(400).send(error)
        console.log('Error logging in \n' + error)
    }

})


//Logout current session
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


//Logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {

    try {

        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send()
    }
})


// Get Profile
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})


//Updating User
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdate = ["name", "age", "password", "email"]
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid Update Request' })
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        // It bypasses the mongoose middleware 
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        res.status(200).send(user)

    } catch (error) {
        res.status(400).send(error)
    }

})


//Deleting User
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
        sendCancelEmail(req.user.email,req.user.name)
    } catch (e) {
        res.status(500).send()
    }
})


//upload profile picture
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload a image'))
        }
        cb(undefined, true);
    }
})


// upload avatar
router.post('/users/me/avatar', auth, upload.single('avatars'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(404).send({ error: error.message })
})



// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


// get image
router.get('/users/:id/avatar', async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})














module.exports = router

















// Maintance mode

// get user by ID
// router.get('/users/:id', async (req, res) => {

//     const _id = req.params.id

//     try {
//         const user = await User.findById((_id))
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     } catch (error) {
//         res.status(500).send(error)
//         console.log('Error creating task \n' + error)
//     }
// })


// Get all users
// router.get('/users', async (req, res) => {

//     try {
//         const users = await User.find({})
//         res.status(200).send(users)
//     } catch (error) {
//         res.status(500).send(error)
//         console.log('Error creating task \n' + error)
//     }
// })