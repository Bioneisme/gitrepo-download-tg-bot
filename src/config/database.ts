import {Pool} from 'pg';
import {PG} from "./settings";

export const pool = new Pool({
    user: PG.user,
    host: PG.host,
    password: PG.password,
    database: PG.database,
    port: PG.port
});