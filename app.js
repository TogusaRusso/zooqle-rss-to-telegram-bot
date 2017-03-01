'use strict'

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const bot = require('./logic/bot')
// var users = require('./routes/users')

const dburi = process.env.MONGOLAB_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017'
const mongoose = require('mongoose')
mongoose.connect(dburi)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => { console.log('connected to database') })

// I will use Heroku.Scheduler instead of cron
// const CronJob = require('cron').CronJob
// const updateBot = require('./logic/update_bot')
// let job = new CronJob('0 */30 * * * *', updateBot)
// job.start()
// console.log(`scheduled updates for every 30 minutes`)

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'zq-favicon32.png')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/robots.txt', (req, res) => {
    res.type('text/plain')
    res.send("User-agent: *\nDisallow: /")
})

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})
bot.setWebHook(process.env.WEBHOOK + bot.token)

app.use('/', index)
// app.use('/users', users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
