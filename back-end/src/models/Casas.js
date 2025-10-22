import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Sensores from "./Sensor";

export default class Casas extends Model {}

Casas.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    endereco: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    numero_moradores: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sensor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {references: Sensores, key: 'id'}
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        allowNull: false,
        defaultValue: 'ativo'
    }
}, {
    sequelize,
    tableName: 'casas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})