import fs from 'fs';
import moment from "moment";
import {Context} from "telegraf";
import {Message} from 'typegram';
import {https} from 'follow-redirects';
import logging from "../config/logging";
import {pool} from "../config/database";

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
        const dest: string = `${username}-${repo}.zip`;
        const URL: string = `https://github.com/${username}/${repo}/archive/master.zip`;
        const source: string = './src/uploads/' + dest;

        /** checking for existing file in database */
        pool.query('SELECT * FROM repositories WHERE file = $1', [dest])
            .then((res) => {
                if (res.rows.length) { /** exists */
                    if (ctx.message)
                        logging.info(ctx.message.from, `${dest} already saved in database`);

                    /** catching for empties (if empty - recreate file) */
                    console.log(res.rows)
                    const fromDate = moment(moment(res.rows[0].createdat)).fromNow()
                    return ctx.replyWithDocument({source},
                        {caption: `Uploaded ${fromDate} (${moment(res.rows[0].createdat)})`})
                        .catch(() => {
                            if (ctx.message)
                                logging.warn(ctx.message.from, `${dest} is empty`);
                            createFile();
                        });
                } else {
                    if (ctx.message)
                        logging.warn(ctx.message.from, `${dest} not found in database`);
                    createFile();
                }
            });

        function createFile() {
            const file = fs.createWriteStream(source);

            const request = https.get(URL, response => {
                if (response.statusCode !== 200) {
                    fs.unlink(dest, () => {
                        if (ctx.message) {
                            logging.error(ctx.message.from, response.statusMessage, 'download',
                                (ctx.message as Message.TextMessage).text);

                            ctx.reply(`File (${URL}) ${response.statusMessage}. Please check nickname and repo name`);
                        }
                    });
                    return;
                }
                response.pipe(file);
            });

            file.on('finish', async () => {
                file.close();
                const currentDate: string = moment().format();
                /** Inserting file to database */
                pool.query('INSERT INTO repositories (file, path, createdAt) VALUES ($1, $2, $3)',
                    [dest, source, currentDate]).then(() => {
                    if (ctx.message)
                        logging.info(ctx.message.from, `File ${dest} successfully saved`);

                    ctx.reply(`New file successfully saved!`);
                }).catch(e => {
                    if (ctx.message) {
                        logging.error(ctx.message.from, e.message, 'db_upload',
                            (ctx.message as Message.TextMessage).text);
                    }
                });

                await ctx.replyWithDocument({source}, {caption: `Uploaded now (${moment(currentDate)})`});
            });

            request.on('error', err => {
                fs.unlink(dest, () => {
                    if (ctx.message) logging.warn(ctx.message.from, err.message);
                });
            });

            file.on('error', err => {
                fs.unlink(dest, () => {
                    if (ctx.message) logging.warn(ctx.message.from, err.message);
                });
            });

            request.end();
        }
    }
}

export default new Commands();