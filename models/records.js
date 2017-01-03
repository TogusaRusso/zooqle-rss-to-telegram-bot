'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RecordSchema = new Schema({
  title: {type: 'String', required: true},
  content: {type: 'String', required: true},
  link: {type: 'String', required: true, index: true, unique: true},
  magnet: {type: 'String', required: true}
})
module.exports = mongoose.model('Record', RecordSchema)
