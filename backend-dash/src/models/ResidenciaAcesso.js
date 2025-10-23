import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { v4 as uuidv4 } from 'uuid';
import User from "./User.js";

export default class ResidenciaAcesso extends Model {}

ResidenciaAcesso.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    residencia_type: {
        type: DataTypes.ENUM('casa', 'apartamento'),
        allowNull: false
    },
    residencia_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    codigo_acesso: {
        type: DataTypes.CHAR(36),
        defaultValue: () => uuidv4(),
    },
    responsavel_id: {
        type: DataTypes.CHAR(36),
        references: {model: User, key: 'id'}
    }
}, {
    sequelize,
    tableName: 'residencias_acesso',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})