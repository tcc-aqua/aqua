import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";

export default class GamificationLog extends Model {}

GamificationLog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Ex: "Meta semanal concluída", "Economia de 50L"'
    },
    related_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID da meta ou outra entidade relacionada'
    },
    related_type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Ex: "meta", "economia_diaria"'
    }
}, {
    sequelize,
    tableName: 'gamification_logs',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
});

GamificationLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(GamificationLog, { foreignKey: 'user_id' });