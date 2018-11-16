const Telegraf = require('telegraf');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const db = require('./Db');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(Telegraf.log())

const welcomeMessage = (name) => {
    return `Welcome ${name}. I will help you take your attendance better`;
}

bot.start((ctx) => {
    const userId = ctx.from.id;
    const firstName = ctx.from.first_name;
    db.insert({id: userId, name: firstName });
    ctx.reply(welcomeMessage(firstName))
});

const keyboard = Markup.inlineKeyboard([
    Markup.callbackButton('❤️', 'http://telegraf.js.org'),
    Markup.callbackButton('Delete', 'delete')
]);

// bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard)));

bot.hears(/new/, (ctx) => {
    ctx.reply('Alright', Extra.markup(keyboard));
    
});

bot.command('random', (ctx) => {
    return ctx.reply('random example',
      Markup.inlineKeyboard([
        Markup.removeKeyboard('Coke', 'Coke'),
        Markup.removeKeyboard('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
        Markup.removeKeyboard('Pepsi', 'Pepsi')
      ]).extra()
    )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
    return ctx.reply('Keyboard wrap', Extra.markup(
      Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
        columns: parseInt(ctx.match[2])
      })
    ))
  })

bot.action('Dr Pepper', (ctx, next) => {
    return ctx.reply('👍').then(() => next())
})

// bot.help((ctx) => ctx.reply('Send me a sticker'))
// bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.startPolling()