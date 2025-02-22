import env from './services/env';

const handle_test_envs = /test/.test(env.NODE_ENV) ? env.NODE_ENV.split(':')[0] : env.NODE_ENV;

export default handle_test_envs;
