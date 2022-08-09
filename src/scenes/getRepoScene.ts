import {Scenes} from "telegraf";
import {Message} from "typegram";
import commands from "../commands/main";

let username: string;
let repo: string;

export const getRepoScene = new Scenes.WizardScene(
    'getRepo',
    async (ctx) => {
        await ctx.reply('GitHub username: ');
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (ctx.message) {
            username = (ctx.message as Message.TextMessage).text;
            await ctx.reply('Repository name: ')
            return ctx.wizard.next();
        }
    },
    async (ctx) => {
        if (ctx.message) {
            repo = (ctx.message as Message.TextMessage).text;
            await ctx.scene.leave();
            return commands.downloadRepo(ctx, username, repo);
        }
    }
)