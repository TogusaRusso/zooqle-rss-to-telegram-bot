'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, required: true},
  _record: {type: Schema.Types.ObjectId, required: true}
})
module.exports = mongoose.model('Post', PostSchema)
