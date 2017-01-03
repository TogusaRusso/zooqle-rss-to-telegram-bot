const express = require('express')
const router = express.Router()
const dbClient = require('../logic/db')
const ObjectId = require('mongodb').ObjectID


router.get(`/magnet:`, (req, res, next) => {
  let magnet = req.url.slice(1)
  console.log(magnet)
  if (magnet) {
    dbClient((db) => {
      const collection = db.collection('records')
      collection.find({magnet: magnet}).toArray((err, records) => {
        if (err) { return console.error(err) }
        if (records.length === 0) {
          next(new Error('Magnet link not in database'))
        } else {
          let record = records[0]
          db.close()
          res.render('magnet', { title: record.title, record: record })
        }    
      })
      
    })
  } else {
    next(new Error('Wrong magnet link'))
  }
})

router.get(/\/id(.*)/, (req, res, next) => {
  let id = req.params[0]
  if (id) {
    dbClient((db) => {
      const collection = db.collection('records')
      collection.find({_id: ObjectId(id)}).toArray((err, records) => {
        if (err) { return console.error(err) }
        if (records.length === 0) {
          next(new Error('Id not in database'))
        } else {
          let record = records[0]
          db.close()
          res.render('magnet', { title: record.title, record: record })
        }    
      })
    })
  } else {
    next(new Error('Wrong id'))
  }
})


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
