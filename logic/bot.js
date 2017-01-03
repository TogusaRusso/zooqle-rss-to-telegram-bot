'use strict'

const rss = require('./rss')
const Telegram = require('node-telegram-bot-api')
// const url = 'https://zooqle.com/rss/tv/2804tk2t6s.rss'

const bot = new Telegram(process.env.TOKEN)

bot.onText(/^\/rss (https:\/\/zooqle\.com\/rss\/tv\/[\da-z]+\.rss)/,
  (msg, match) => {
    const chatId = msg.chat.id
    const url = match[1]

    rss(url, (record) => {
      let message = `*${record.title}*
      _${record.content}_
      ${process.env.WEBHOOK}id${record._id}`
      bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    })
  }
)

module.exports = bot
