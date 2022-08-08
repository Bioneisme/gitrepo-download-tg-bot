import {Context, Markup, Telegraf} from 'telegraf';
import {Update, Message} from 'typegram';
import logging from "./config/logging";
import config from "./config/settings";

const token: string = config.bot.token;

const app: Telegraf<Context<Update>> = new Telegraf(token);


app.use(async (ctx, next) => {
    if (ctx.message)
        logging.info(ctx.message.from, (ctx.message as Message.TextMessage).text);
    await next();
});

app.start((ctx) => {
    ctx.reply('Hello ' + ctx.from.first_name + '!');
});

app.help((ctx) => {
    ctx.reply('Send /start to receive a greeting');
    ctx.reply('Send /keyboard to receive a message with a keyboard');
    ctx.reply('Send /quit to stop the bot');
});

app.command('quit', (ctx) => {
    ctx.telegram.leaveChat(ctx.message.chat.id).then(() => {
        ctx.leaveChat();
    }).catch(e => {
        logging.error(ctx.message.from, e.message, e.on.method, ctx.message.text);
    })
});

app.command('keyboard', (ctx) => {
    ctx.reply(
        'Keyboard',
        Markup.inlineKeyboard([
            Markup.button.callback('First option', 'first'),
            Markup.button.callback('Second option', 'second'),
        ])
    );
});

app.on('text', (ctx) => {
    ctx.reply(
        'You choose the ' +
        (ctx.message.text === 'first' ? 'First' : 'Second') +
        ' Option!'
    );
});

app.launch().then(() => {
    console.log('Bot started')
});

process.once('SIGINT', () => app.stop('SIGINT'));
process.once('SIGTERM', () => app.stop('SIGTERM'));