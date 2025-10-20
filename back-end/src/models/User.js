import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'

export default class User extends Model {
    // compare hash password
    async checkPassword(password) {
        return bcrypt.compare(password, this.password)
    }
}

User.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cpf: {
        type: DataTypes.CHAR(14),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('morador', 'sindico'),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',

    // hooks hash password
    hooks: {

        // hash create user
        beforeCreate: async (user, options) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },

        // hash update user
        beforeUpdate: async (user, options) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt)
            }
        }
    }
})