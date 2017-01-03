'use strict'

const rss = require('rss-parser')
const parser = require('./parser')
const Record = require('../models/records')

module.exports = (url, cb) => {
  rss.parseURL(url, (err, parsed) => {
    if (err) return console.error(err)
    // console.log(parsed.feed.title)
    parsed.feed.entries.forEach((entry) => {
      // let's check if entry was already parsed
      Record.where({link: entry.link}).findOne((err, record) => {
        if (err) { return console.error(err) }
        if (!record) {
          console.log(`that's new entry, let's parse it`)
          parser(entry.link, (magnet) => {
            const record = new Record({
              title: entry.title,
              content: entry.content,
              link: entry.link,
              magnet: magnet
            })
            record.save((err, result) => {
              if (err) { return console.error(err) }
              console.log('saved new record in database')
              cb(result)
            })
          })
        } else {
          // console.log('this record already was parsed')
          cb(record)
        }
      })
    })
  })
}

