import moment from "moment";

type User = {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string | undefined;
    language_code?: string | undefined;
};

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