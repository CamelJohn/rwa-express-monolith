import { Sequelize } from 'sequelize';
import env from '../services/env';
import handle_test_envs from '../helpers';

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
    logging: false,
});

const sqlite = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    define: {
        timestamps: true,
    },
    logging: false,
});

const test = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    define: {
        timestamps: true,
    },
    logging: false,
});

const db_map: Record<string, Sequelize> = {
    docker: postgres,
    development: sqlite,
    test,
};

const connection = db_map[handle_test_envs];

const database = {
    $connect: () => connection.sync({ logging: false, force: true }),
    $disconnect: () => connection.close(),
    connection,
};


export default database;
