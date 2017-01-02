'use strict'

const rss = require('./rss')
const url = 'https://zooqle.com/rss/tv/2804tk2t6s.rss'

rss(url, (record) => {
  console.log(record)
})