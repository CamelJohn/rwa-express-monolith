import JWT from 'jsonwebtoken';
import env from './env';
import createHttpError from 'http-errors';
import User from '../auth/user.model';

interface TokenDto {
    userId: string;
    email: string;
}

const tokenService = {
    generate(dto: TokenDto) {
        return JWT.sign(dto, env.JWT_SECRET, { expiresIn: '24h' });
    },

    validate(token: string) {
        try {
            return JWT.verify(token, env.JWT_SECRET);
        } catch (error) {
            console.error({ token_validation_error: error });
            throw new createHttpError.Unauthorized('Invalid token');
        }
    },

    parse(token: string) {
        const decoded = JWT.decode(token, { complete: true });

        if (!decoded) {
            throw new createHttpError.Unauthorized('Invalid token');
        }

        if (typeof decoded.payload === 'string') {
            throw new createHttpError.Unauthorized('Invalid token');
        }

        return decoded.payload as TokenDto;
    },
    
    async get(userId: string) {
        const result = await User.findByPk(userId);

        if (!result) {
            throw new createHttpError.NotFound('Invalid credential');
        }

        const user = result.toJSON();

        if (!user.token) {
            return tokenService.generate({ userId: user.id, email: user.email });
        }

        return user.token;
    }
};


export default tokenService;