import LocalSession from 'telegraf-session-local';
import {Context, Telegraf, Scenes} from 'telegraf';
import {Message} from 'typegram';
import {getRepoScene} from './scenes/getRepoScene';
import commands from './commands/main';
import logging from './config/logging';
import {BOT} from './config/settings';

interface BotContext extends Context {
    myContextProp: string
    scene: Scenes.SceneContextScene<BotContext, Scenes.WizardSessionData>
    wizard: Scenes.WizardContextWizard<BotContext>
}

const token: string = BOT.token;
const app: Telegraf<BotContext> = new Telegraf(token);

// @ts-ignore
const stage = new Scenes.Stage([getRepoScene], {ttl: 10});
const session = new LocalSession();

app.use(session.middleware())
// @ts-ignore
app.use(stage.middleware())

/** Logging middleware */
app.use(async (ctx, next) => {
    if (ctx.callbackQuery)
        logging.info(ctx.callbackQuery?.from, `[markup] ${ctx.callbackQuery.data}`);
    else
        logging.info(ctx.message?.from, (ctx.message as Message.TextMessage)?.text);

    await next();
});

app.start(commands.start);

app.help(commands.help);

app.command('getRepo', (ctx) => { ctx.scene.enter('getRepo') });
app.action('/getRepo', (ctx) => { ctx.scene.enter('getRepo') });
app.command('getAllRepos', commands.getRepos);
app.action('/getAllRepos', commands.getRepos);

app.launch().then(() => { logging.info(undefined,'Bot started') });

process.once('SIGINT', () => app.stop('SIGINT'));
process.once('SIGTERM', () => app.stop('SIGTERM'));