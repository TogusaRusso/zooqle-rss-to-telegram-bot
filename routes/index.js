const express = require('express')
const router = express.Router()
const Record = require('../models/records')

router.get(/\/id(.*)/, (req, res, next) => {
  let id = req.params[0]
  console.log(id)
  if (id) {
    Record.where({_id: id}).findOne((err, record) => {
      if (err) { return console.error(err) }
      if (!record) {
        next(new Error('Id not in database'))
      } else {
        res.render('magnet', { title: record.title, record: record })
      }
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
