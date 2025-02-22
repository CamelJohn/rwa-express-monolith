export interface AuthUserDto {
    email: string;
    token: string | null;
    username: string;
    bio: string | null;
    image: string | null;
}

export interface BaseUser {
    email: string;
    username: string;
    password: string;
}
