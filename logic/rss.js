'use strict'

const rss = require('rss-parser')
const parser = require('./parser')
const dbClient = require('./db')

module.exports = (url, cb) => {
  rss.parseURL(url, (err, parsed) => {
    if (err) return console.error(err)
    // console.log(parsed.feed.title)
    parsed.feed.entries.forEach((entry) => {
      // let's check if entry was already parsed
      dbClient((db) => {
        // Connected to database
        const collection = db.collection('records')
        collection.find({link: entry.link}).toArray((err, records) => {
          if (err) { return console.error(err) }
          if (records.length === 0) {
            console.log(`that's new entry, let's parse it`)
            parser(entry.link, (magnet) => {
              const record = {
                title: entry.title,
                content: entry.content,
                link: entry.link,
                magnet: magnet
              }
              collection.insertOne(record, (err, result) => {
                if (err) { return console.error(err) }
                console.log('saved new record in database')
                record._id = result.insertedIdit
                db.close()
                cb(record)
              })
            })
          } else {
            // console.log('this record already was parsed')
            db.close()
            cb(records[0])
          }
        })
      })
    })
  })
}

