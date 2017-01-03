'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  chatId: {type: 'String', required: true},
  rss: {type: 'String', required: true}
})
module.exports = mongoose.model('User', UserSchema)
