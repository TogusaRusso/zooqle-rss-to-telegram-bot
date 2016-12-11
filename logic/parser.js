'use strict'

const cloudscraper = require('cloudscraper')
const htmlparser = require('htmlparser2')

function parsePage (link, callback) {
  const parser = new htmlparser.Parser({
    onopentag: (name, attr) => {
      if (name === 'a' &&
        !attr.title &&
        attr.href &&
        attr.href.indexOf('magnet:') !== -1) {
        // console.log(attr)
        callback(attr.href)
      }
    }
  }, {decodeEntities: true})
  cloudscraper.get(link, (error, response, body) => {
    if (error) return console.error(error)
    parser.write(body)
    parser.end()
  })
}

module.exports = parsePage
