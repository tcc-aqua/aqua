import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import { v4 as uuidv4 } from 'uuid';
import User from './User.js';

export default class PasswordReset extends Model { }

PasswordReset.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: User, key: "id" }
    },
    token: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    expira_em: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 3600 * 1000) 
    }

}, {
    sequelize,
    tableName: 'password_resets',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
})
