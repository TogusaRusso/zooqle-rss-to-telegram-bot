const rss = require('./rss')
const Telegram = require('node-telegram-bot-api')
const User = require('../models/users')
const Post = require('../models/posts')

const bot = new Telegram(process.env.TOKEN)

module.exports = (cb) => {
  let count = 0
  User.find((err, users) => {
    if (err) return console.error(err)
    for (let user of users) {
      console.log(`looking in ${user.rss}`)
      rss(user.rss, (record) => {
        console.log(`records count is ${++count}`)
        Post.where({_user: user._id, _record: record._id})
        .findOne((err, post) => {
          if (err) return console.erreor(err)
          if (post) {
            console.log(`it's old record count now is ${--count}`)
            if (count === 0) {
              cb()
            }
          }
          if (!post) {
            // this is new post, let save it and post it
            console.log(`found new post ${record.link}`)
            let newPost = new Post({
              _user: user._id,
              _record: record._id
            })
            newPost.save((err) => {
              if (err) return console.error(err)
              let message = `*${record.title}*
              _${record.content}_
              ${process.env.WEBHOOK}id${record._id}`
              bot.sendMessage(user.chatId, message, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
              })
              console.log(`records count is ${--count}`)
              if (count === 0) {
                cb()
              }
            })
          }
        })
      })
    }
  })
}
