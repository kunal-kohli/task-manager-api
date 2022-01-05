const express = require('express')
require('./db/mongoose')
const userRouter = require('../src/routers/users')
const taskRouter = require('../src/routers/tasks')


const app = express()
const port = process.env.PORT



// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// maintenance mode
// app.use((req, res, next) => {
//     res.status(500).send('Site is currently unavailable. Please try again later.')
// })







app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// encryption
// text  -> saflkajdajsda;dkapdjq;a -> text

// hashing algorithm - one way
// text  -> lsjdlajdaijdajdijwoqwidwoad 









app.listen(port, (error) => {
    if (error) {
        return console.log('Error starting server! \n' + error)
    }
    console.log('Server is up and running on port: ' + port)
})