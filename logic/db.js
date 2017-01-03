'use strict'

const dburi = process.env.MONGOLAB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017'
const MongoClient = require('mongodb').MongoClient

module.exports = (cb) => {
  MongoClient.connect(
        dburi,
        { server: { auto_reconnect: true } },
        (err, db) => {
          if (err) return console.error(err)
          cb(db)
        }
  )
}
