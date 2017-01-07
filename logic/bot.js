'use strict'

const Telegram = require('node-telegram-bot-api')
const User = require('../models/users')
const bot = new Telegram(process.env.TOKEN)

bot.onText(/^\/rss (http:\/\/feeds\.feedburner\.com\/(.*))/,
  (msg, match) => {
    const chatId = msg.chat.id
    const url = match[1]
    User.where({chatId: chatId, rss: url}).findOne((err, user) => {
      if (err) return console.error(err)
      if (user) {
        bot.sendMessage(chatId, 'Вы уже добавили этот rss поток')
      } else {
        let newUser = new User({
          chatId: chatId,
          rss: url
        })
        newUser.save((err, result) => {
          if (err) return console.error(err)
          bot.sendMessage(chatId, 'Новый rss поток сохранен')
        })
      }
    })
  }
)

module.exports = bot
