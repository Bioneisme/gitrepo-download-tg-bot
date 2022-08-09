"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
// overload console function to logging in txt file
const logFile = fs_1.default.createWriteStream('./src/logs.log', { flags: 'a' });
const logStdout = process.stdout;
console.log = function (d) {
    logFile.write(util_1.default.format(d) + '\n');
    logStdout.write(util_1.default.format(d) + '\n');
};
console.info = console.log;
console.warn = console.log;
console.error = console.log;
console.debug = console.log;
const info = (user, message) => {
    if (user)
        return console.info(`[${getTimeStamp()}] [INFO] (${user.username || user.id}): ${message}`);
    return console.info(`[${getTimeStamp()}] [INFO] ${message}`);
};
const error = (user, message) => {
    if (user)
        return console.error(`[${getTimeStamp()}] [ERROR] (${user.username || user.id}): ${message}`);
    return console.error(`[${getTimeStamp()}] [ERROR] ${message}`);
};
const warn = (user, message) => {
    if (user)
        return console.warn(`[${getTimeStamp()}] [WARN] (${user.username || user.id}): ${message}`);
    return console.warn(`[${getTimeStamp()}] [WARN] ${message}`);
};
const debug = (user, message) => {
    if (user)
        return console.debug(`[${getTimeStamp()}] [DEBUG] (${user.username || user.id}): ${message}`);
    return console.debug(`[${getTimeStamp()}] [DEBUG] ${message}`);
};
const getTimeStamp = () => {
    return (0, moment_1.default)().toString();
};
exports.default = {
    info,
    error,
    warn,
    debug
};
