import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN: string = process.env.BOT_TOKEN as string;

const BOT = {
    token: BOT_TOKEN
};

const config = {
    bot: BOT
};

export default config;