export const new_user = {
    user: {
        email: 'test@test.com',
        password: 'password',
        username: 'tester',
    },
};

export const registered_user = {
    user: {
        email: 'test@test.com',
        password: 'password',
    },
};

export const unregistered_user = {
    user: {
        email: 'liar@liar.com',
        password: 'smuckers',
    },
};

export const named_registered_user = {
    user: {
        email: 'test@test.com',
        password: 'password',
        username: 'tester',
    },
};

export const named_registered_user_update_dto = {
    user: {
        username: 'tester3',
    },
};

export const named_registered_user_updated = {
    user: {
        username: 'tester3',
        email: 'test@test.com',
        password: 'password',
    },
};

export const named_registered_user_update_bad_dto = {
    user: {},
};
