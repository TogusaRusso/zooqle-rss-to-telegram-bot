'use strict'

const dburi = process.env.MONGOLAB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017'
const mongoose = require('mongoose')
mongoose.connect(dburi)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'updatter connection error:'))
db.once('open', () => { console.log('updater connected to database') })

const updateBot = require('./update_bot')
updateBot()
