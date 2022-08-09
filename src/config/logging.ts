import moment from "moment";
import util from "util";
import fs from "fs";

type User = {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string | undefined;
    language_code?: string | undefined;
};

// overload console function to logging in txt file
const logFile = fs.createWriteStream('./src/debug.log', { flags: 'a' });
const logStdout = process.stdout;

console.log = function(d) {
    logFile.write(util.format(d) + '\n');
    logStdout.write(util.format(d) + '\n');
};

console.info = console.log;
console.warn = console.log;
console.error = console.log;
console.debug = console.log;


const info = (user: User | undefined, message: string): void => {
    if (user)
        return console.info(`[${getTimeStamp()}] [INFO] (${user.username || user.id}): ${message}`);

    return console.info(`[${getTimeStamp()}] [INFO] ${message}`);
};

const error = (user: User | undefined, message: string): void => {
    if (user)
        return console.error(`[${getTimeStamp()}] [ERROR] (${user.username || user.id}): ${message}`);

    return console.error(`[${getTimeStamp()}] [ERROR] ${message}`);
};

const warn = (user: User | undefined, message: string): void => {
    if (user)
        return console.warn(`[${getTimeStamp()}] [WARN] (${user.username || user.id}): ${message}`);

    return console.warn(`[${getTimeStamp()}] [WARN] ${message}`);
};

const debug = (user: User | undefined, message: string): void => {
    if (user)
        return console.debug(`[${getTimeStamp()}] [DEBUG] (${user.username || user.id}): ${message}`);

    return console.debug(`[${getTimeStamp()}] [DEBUG] ${message}`);
};

const getTimeStamp = (): string => {
    return moment().toString();
};

export default {
    info,
    error,
    warn,
    debug
};