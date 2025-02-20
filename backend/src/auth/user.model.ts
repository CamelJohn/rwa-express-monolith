import database from '../database';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { DataTypes, Model } from 'sequelize';
import env from '../env';

interface UserCreationAttributes {
    username: string;
    email: string;
    password: string;
}

interface UserAttributes extends UserCreationAttributes {
    id: string;
    bio: string | null;
    token: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface AuthUserDto {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public username!: string;
    public email!: string;
    public password!: string;
    public bio!: string | null;
    public token!: string;
    public image!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    toAuthJSON(): AuthUserDto {
        const { id, password, createdAt, updatedAt, ...user } = this.toJSON();

        return user;
    }
}

async function handlePassword(user: User) {
    if (user.password && user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
}

async function handleToken(user: User) {
    if (user.email && user.changed('email')) {
        const token = JWT.sign({ email: user.email }, env.JWT_SECRET);
        user.token = token;
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 8,
                isAlphanumeric: true,
            },
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        bio: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'User',
        sequelize: database.connection,
        hooks: {
            beforeSave: async (user) => {
                await handlePassword(user);
                await handleToken(user);
            },

            beforeUpdate: async (user) => {
                await handlePassword(user);
                await handleToken(user);
            },
        },
    }
);

await User.sync({ force: false, logging: false });

export default User;
