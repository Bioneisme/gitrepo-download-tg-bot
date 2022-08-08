import {Context, Telegraf, Scenes, session} from 'telegraf';
import {Message} from 'typegram';
import {getRepoScene} from './scenes/getRepoScene';
import commands from './commands/main';
import logging from './config/logging';
import config from './config/settings';

export interface BotContext extends Context {
    myContextProp: string
    scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>
    wizard: Scenes.WizardContextWizard<BotContext>
}

const token: string = config.bot.token;
const app: Telegraf<BotContext> = new Telegraf(token);
// @ts-ignore
const stage = new Scenes.Stage([getRepoScene], {ttl: 10})

app.use(session())
// @ts-ignore
app.use(stage.middleware())

/** Logging middleware */
app.use(async (ctx, next) => {
    if (ctx.message)
        logging.info(ctx.message.from, (ctx.message as Message.TextMessage).text);

    await next();
});

app.start(commands.start);

app.help(commands.help);

app.command('getRepo', async (ctx) => {
    ctx.scene.enter('getRepo')
});


app.launch().then(() => {
    console.log('Bot started')
});

process.once('SIGINT', () => app.stop('SIGINT'));
process.once('SIGTERM', () => app.stop('SIGTERM'));

// app.command('quit', (ctx) => {
//     ctx.telegram.leaveChat(ctx.message.chat.id).then(() => {
//         ctx.leaveChat();
//     }).catch(e => {
//         logging.error(ctx.message.from, e.message, e.on.method, ctx.message.text);
//     })
// });

// app.command('keyboard', (ctx) => {
//     ctx.reply(
//         'Keyboard',
//         Markup.inlineKeyboard([
//             Markup.button.callback('First option', 'first'),
//             Markup.button.callback('Second option', 'second'),
//         ])
//     );
// });