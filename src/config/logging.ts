type User = {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string | undefined;
    language_code?: string | undefined;
};

const info = (user: User, message: string): void => {
    return console.info(`[${getTimeStamp()}] [INFO] (${user.username || user.id}): ${message}`);
};

const error = (user: User, error: string | undefined, method: string, message: string): void => {
    return console.error(`[${getTimeStamp()}] [ERROR] ${error} [METHOD: ${method}] | (${user.username || user.id}): ${message}`);
};

const warn = (user: User, message: string): void => {
    return console.warn(`[${getTimeStamp()}] [WARN] (${user.username || user.id}): ${message}`);
};

const debug = (user: User, message: string): void => {
    return console.debug(`[${getTimeStamp()}] [DEBUG] (${user.username || user.id}): ${message}`);
};

const getTimeStamp = (): string => {
    return new Date().toUTCString();
};

export default {
    info,
    error,
    warn,
    debug
};