import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";

export default class Conversa extends Model {}

Conversa.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'conversas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});
