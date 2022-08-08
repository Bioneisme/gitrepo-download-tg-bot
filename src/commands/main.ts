import {Context} from "telegraf";
import {Message} from 'typegram';
import {https} from 'follow-redirects';
import fs from 'fs';
import logging from "../config/logging";

class Commands {
    async start(ctx: Context) {
        await ctx.reply('Hello ' + ctx.from?.first_name + '!');
    }

    async help(ctx: Context) {
        await ctx.reply('Send /start to receive a greeting');
        await ctx.reply('Send /keyboard to receive a message with a keyboard');
        await ctx.reply('Send /quit to stop the bot');
    }

    async downloadRepo(ctx: Context, username: string, repo: string) {
        const date: string = new Date().toUTCString().split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/).join('_');

        const dest: string = `${username}-${repo}.zip`
        const URL: string = `https://github.com/${username}/${repo}/archive/master.zip`;

        const file = fs.createWriteStream(dest);

        const request = https.get(URL, response => {
            if (response.statusCode !== 200) {
                fs.unlink(dest, () => {
                    if (ctx.message) {
                        logging.error(ctx.message.from, response.statusMessage, 'download',
                            (ctx.message as Message.TextMessage).text);

                        ctx.reply(`File (${URL}) ${response.statusMessage}. Please check nickname and repo name`)
                    }
                });
                return;
            }

            response.pipe(file);
        });

        file.on('finish', async () => {
            file.close();
            if (ctx.message) {
                await ctx.reply(`File ${dest} successfully saved!`)
                logging.info(ctx.message.from, `File ${file.path} successfully saved`)
            }
        });

        request.on('error', err => {
            fs.unlink(dest, () => {
            });
        });

        file.on('error', err => {
            fs.unlink(dest, () => {
            });
        });

        request.end();
    }
}

export default new Commands();