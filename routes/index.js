const express = require('express')
const router = express.Router()

/*
const magReg = new RegExp('' +
  /magnet:\?/.source +
  /xt=urn:btih:[A-F\d]{20,50}&/.source +
  /dn=%5Bzooqle.com%5D(?:[\w\-.,]|%[A-F\d]{2})+/.source +
  /(?:&tr=(?:[\w\-.,]|%[A-F\d]{2})+)/.source,
'i')
*/

// const xt = /^urn:btih:[A-F\d]{20,50}$/
const dn = /^\[zooqle\.com][\w\s[\]\-.,]+$/i

router.get(`/magnet:`, (req, res, next) => {
  // console.log(req.query)
  // let magnet = req.url.match(magReg)
  let magnet = req.url.slice(1)
  if (magnet && req.query.dn.match(dn)) {
    console.log(magnet)
    res.render('magnet', { title: req.query.dn, magnet: magnet })
  } else {
    next(new Error('Wrong magnet link'))
  }
})
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
