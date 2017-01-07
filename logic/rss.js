'use strict'

const htmlparser = require('htmlparser2')
const http = require('http')
const Record = require('../models/records')

// states
const FEED  = 'feed'
const ITEM  = 'item'
const TITLE = 'title'
const LINK  = 'link'
const DESCRIPTION = 'description'
const MAGNET = 'torrent:magneturi'

const unCdata = (text) => text.match(/\[CDATA\[([\s\S]*)\]\]/)[1]


const parseRss = (url, cb) => {
  let state = FEED
  let entry = {}
  const parser = new htmlparser.Parser({
    onopentag: (name, attr) => {
      if (state === FEED && name === ITEM) {
        state = ITEM
        entry = {
          title: '',
          content: '',
          link: '',
          magnet:''
        }
      }
      if (state === ITEM && name === TITLE) state = TITLE
      if (state === ITEM && name === DESCRIPTION) state = DESCRIPTION
      if (state === ITEM && name === LINK) state = LINK
      if (state === ITEM && name === MAGNET) state = MAGNET
    },
    ontext: (text) => {
      if (state === TITLE) {
        entry.title = text 
        state = ITEM 
      }
      if (state === LINK) { 
        entry.link = text
        state = ITEM 
      }
    },
    oncomment: (text) => {
      if (state === DESCRIPTION) {
        entry.content = unCdata(text)
        state = ITEM
      }
      if (state === MAGNET) {
        entry.magnet = unCdata(text)
        state = ITEM
      }
    },
    onclosetag: (name) => {
      if (state === ITEM && name === ITEM) {
        state = FEED
        cb(entry)
      }
    }
  },{decodeEntities: true})
  http.get(url, (res) => {
    res.on('data', (chunk) => parser.write(chunk))
    .on('end', () => parser.end())
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
  })
}

module.exports = (url, cb) => {
  parseRss(url, (entry) => {
    Record.where({link: entry.link}).findOne((err, record) => {
      if (err) return console.error(err)
      if (!record) {
        console.log(`that's new entry, let's parse it`)
        let newRecord = new Record(entry)
        newRecord.save((err, result) => {
          if (err) { return console.error(err) }
          console.log(`saved new record in database ${entry.link}`)
          cb(result)
        })
      } else {
        // this record already was parsed
        cb(record)
      }
    })
  })
}
