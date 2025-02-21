import { Sequelize } from 'sequelize';
import env from '../services/env';

const postgres = new Sequelize({
    dialect: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    define: {
        timestamps: true,
    },
});

const sqlite = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    define: {
        timestamps: true,
    },
});

const db_map: Record<string, Sequelize> = {
    docker: postgres,
    development: sqlite,
};

const connection = db_map[env.NODE_ENV];
const database = {
    $connect: () => connection.sync({ logging: false, force: true }),
    $disconnect: () => connection.close(),
    connection,
};


export default database;
