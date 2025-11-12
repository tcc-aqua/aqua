import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";

export default class Notifications extends Model {}

Notifications.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('mensagem', 'alerta'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
})

Notifications.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notifications, { foreignKey: 'user_id', as: 'notifications' });
