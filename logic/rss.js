'use strict'

const rss = require("rss-parser")
const parser = require("./parser")

//module.exports = (cb) => {
  rss.parseURL("https://zooqle.com/rss/tv/2804tk2t6s.rss", (err, parsed) => { 
    if (err) return console.error(err) 
    console.log(parsed.feed.title)
    parsed.feed.entries.forEach((entry) => {
      //console.log(entry)
      parser(entry.link, (magnet) => {
        let record = {
          title: entry.title,
          content: entry.content,
          link: entry.link,
          magnet: magnet
        }
        console.log(record)
      })
    })
  })
//}



