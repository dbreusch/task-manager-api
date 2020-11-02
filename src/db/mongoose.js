const mongoose = require('mongoose')

// connect to the database
const connectionURL = process.env.MONGODB_URL
const collectionName = 'task-manager-api'
const collectionURL = connectionURL + '/' + collectionName
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

// console.log('Connecting to database...')
mongoose.connect(collectionURL, mongoOptions)