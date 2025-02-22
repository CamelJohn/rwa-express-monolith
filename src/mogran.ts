import morgan from 'morgan';
import handle_test_envs from './helpers';

enum MorganFormats {
    combined = 'combined',
    common = 'common',
    dev = 'dev',
    short = 'short',
    tiny = 'tiny',
    none = 'none',
}

const morgan_config_map: Record<string, ReturnType<typeof morgan>> = {
    // [MorganFormats.combined]: morgan(MorganFormats.combined),
    // [MorganFormats.common]: morgan(MorganFormats.common),
    development: morgan(MorganFormats.dev),
    // [MorganFormats.short]: morgan(MorganFormats.short),
    // [MorganFormats.tiny]: morgan(MorganFormats.tiny),
    test: morgan(() => void 0),
};

const route_logger = morgan_config_map[handle_test_envs];

export default route_logger;
