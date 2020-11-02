const mongoose = require('mongoose')

// connect to the database
const connectionURL = process.env.MONGODB_URL

// previous method that split the base URL from the collection name
// Probably not viable in Heroku setup (11/2/20)
// const collectionName = 'task-manager-api'
// const collectionURL = connectionURL + '/' + collectionName
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

// console.log('Connecting to database...')
mongoose.connect(connectionURL, mongoOptions)