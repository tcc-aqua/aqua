import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Sensor from "./Sensor.js";

export default class Alerta extends Model {}

Alerta.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sensor_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Sensor, key: 'id' } },
    residencia_type: { type: DataTypes.ENUM('casa', 'apartamento'), allowNull: false },
    residencia_id: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.ENUM('vazamento', 'consumo_alto'), allowNull: false },
    mensagem: { type: DataTypes.TEXT, allowNull: true },
    nivel: { type: DataTypes.ENUM('baixo', 'medio', 'alto', 'critico'), defaultValue: 'baixo' },
    resolvido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    sequelize,
    tableName: 'alertas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false 
});