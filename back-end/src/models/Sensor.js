import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'

export default class Sensores extends Model { }

Sensores.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
    },
    consumo_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ultimo_envio: {
        type: DataTypes.DATE,
        allowNull: false
    }
})