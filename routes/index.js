const express = require('express')
const  router = express.Router()

const magReg = /magnet:\?xt=urn:btih:[A-F\d]{20,50}&dn=%5Bzooqle.com%5D(?:[\w\-.,]|%[A-F\d]{2})+/

//const xt = /^urn:btih:[A-F\d]{20,50}$/
//const dn = /^\[zooqle.com\][\w\s\[\]\-.,]+$/i

router.get(`/magnet:`, (req, res, next) => {
  //console.log(req.query)
  let magnet = req.url.match(magReg)
  if (magnet) {
    console.log(magnet[0])
    res.render('magnet', { title: req.query.dn, magnet: magnet[0]})
  } else {
    next(new Error('Wrong magnet link'))
  }
  
})
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
