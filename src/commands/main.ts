import fs from 'fs';
import moment from "moment";
import {Context, Markup} from "telegraf";
import {https} from 'follow-redirects';
import {pool} from "../config/database";
import {CFG} from "../config/settings";
import logging from "../config/logging";

class Commands {
    async start(ctx: Context) {
        await ctx.reply(`My greetings to you, ${ctx.from?.first_name}! 🎉 \n` +
            `I give you the opportunity to download GitHub repositories directly from telegram!\n\n` +
            `You only need to select /getRepo command, and then write github username and repository ✍ \n` +
            `To view all commands and their descriptions, write /help`
        );
    }

    async help(ctx: Context) {
        await ctx.reply(`/start - a greeting\n` +
            `/help - all commands\n` +
            `/getRepo - download github repository\n` +
            `/getAllRepos - get a list of all repositories, that are stored on bot server\n` +
            `-----------------\n` +
            `By default, the bot is downloaded master branch, if there is none, ` +
            `then installed default branch.\n` +
            `After the initial repository download, they are stored on the bot's server.\n` +
            `After ${CFG.days} days, the repository is updated again.`,
            Markup.inlineKeyboard([
                Markup.button.callback('Download repository', '/getRepo'),
                Markup.button.callback('Get all saved repositories', '/getAllRepos'),
            ])
        );
    }

    async downloadRepo(ctx: Context, username: string, repo: string) {
        const dest: string = `${username}-${repo}.zip`;
        const filename: string = `${username}-${repo}`;
        const URL: string = `https://github.com/${username}/${repo}/archive/master.zip`;
        const source: string = './src/uploads/' + dest;

        // checking for existing file in database
        pool.query('SELECT * FROM repositories WHERE file = $1', [dest])
            .then(async (res) => {
                if (res.rows.length) {
                    // exists
                    logging.info(ctx.message?.from, `${dest} already saved in database`);
                    const createdDate = moment(res.rows[0].createdat);
                    const fromDate = moment(moment(res.rows[0].createdat)).fromNow();

                    if (moment().diff(createdDate, 'days') === CFG.days) {
                        logging.warn(ctx.message?.from, `${dest} has been sent for updating`);
                        await ctx.reply(`${CFG.days} days have passed. It's time to update ${filename} file. Updating...`)
                        return createFile(true);
                    }

                    // catching for empties (if empty - recreate file)
                    return ctx.replyWithDocument({source},
                        {caption: `Uploaded ${fromDate} (${createdDate})`})
                        .catch(() => {
                            logging.warn(ctx.message?.from, `${dest} is empty`);
                            // if file is empty, upload new one to server
                            return createFile();
                        });
                } else {
                    logging.warn(ctx.message?.from, `${dest} not found in database`);
                    return createFile();
                }
            });

        function createFile(isUpdate: boolean = false) {
            const file = fs.createWriteStream(source);

            const request = https.get(URL, response => {
                if (response.statusCode !== 200) {
                    fs.unlink(source, (err) => {
                        if (err) logging.error(ctx.message?.from, `${dest} ${err.message}`);

                        logging.error(ctx.message?.from, `${dest} ${response.statusMessage}`);

                        ctx.reply(`File (${URL}) ${response.statusMessage}. ` +
                            `Please check github username and repository name`);
                    });
                    return;
                }
                response.pipe(file);
            });

            file.on('finish', async () => {
                file.close();
                const currentDate: string = moment().format();
                // Inserting file to database
                pool.query('INSERT INTO repositories (file, path, createdAt) VALUES ($1, $2, $3)',
                    [dest, source, currentDate]).then(() => {
                    logging.info(ctx.message?.from, `File ${dest} successfully saved`);

                    ctx.reply(`${filename} successfully saved!`);
                }).catch(e => {
                    logging.error(ctx.message?.from, e.message);
                    // update createdAt timestamp if file is re-uploaded
                    if (isUpdate) {
                        pool.query('UPDATE repositories SET createdAt = $1 WHERE file = $2',
                            [currentDate, dest]).then(() => {
                            logging.info(ctx.message?.from, `File ${dest} successfully updated`);

                            ctx.reply(`${filename} successfully updated!`);
                        }).catch(e => {
                            logging.error(ctx.message?.from, e.message);
                        });
                    }
                });

                return ctx.replyWithDocument({source});
            });

            request.on('error', err => {
                fs.unlink(source, (error) => {
                    if (error) logging.error(ctx.message?.from, `${dest} ${error.message}`);

                    logging.error(ctx.message?.from, `${dest} ${err.message}`);
                });
            });

            file.on('error', err => {
                fs.unlink(source, (error) => {
                    if (error) logging.error(ctx.message?.from, `${dest} ${error.message}`);

                    logging.error(ctx.message?.from, `${dest} ${err.message}`);
                });
            });

            request.end();
        }
    }

    async getRepos(ctx: Context) {
        pool.query(`SELECT file, createdAt FROM repositories`).then(res => {
            let listStr: string = '';
            res.rows.forEach(data => {
                listStr += `${data.file} | ${moment(data.createdat).fromNow()} \n(${moment(data.createdat)})\n`
            });

            return ctx.reply(listStr);
        }).catch(e => {
            logging.error(ctx.message?.from, e.message);
        });
    }
}

export default new Commands();