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
      let url = encodeURI(entry.link)
      Record.where({link: url}).findOne((err, record) => {
        if (err) return console.error(err)
        if (!record) {
          console.log(`that's new entry, let's parse it`)
          parser(url, (magnet) => {
            console.log(`parsed ${url} got ${magnet}`)
            let newRecord = new Record({
              title: entry.title,
              content: entry.content,
              link: url,
              magnet: magnet
            })
            newRecord.save((err, result) => {
              if (err) { return console.error(err) }
              console.log(`saved new record in database ${url}`)
              cb(result)
            })
          })
        } else {
          // this record already was parsed
          cb(record)
        }
      })
    })
  })
}

