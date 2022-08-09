import dotenv from "dotenv";

dotenv.config();

const BOT_TOKEN: string = process.env.BOT_TOKEN as string;
const PG_USER: string = process.env.PG_USER || 'postgres';
const PG_HOST: string = process.env.PG_HOST || 'localhost';
const PG_PASSWORD: string = process.env.PG_PASSWORD || 'root';
const PG_DATABASE: string = process.env.PG_DATABASE || 'repo_bot';
const PG_PORT: number = +(process.env.PG_PORT || '5432');

const UPD_TIME: number = 7 // days

export const BOT = {
    token: BOT_TOKEN
};

export const PG = {
    user: PG_USER,
    host: PG_HOST,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    port: PG_PORT
};

export const CFG = {
    days: UPD_TIME
}

const config = {
    bot: BOT,
    postgres: PG,
    cfg: CFG
};

export default config;