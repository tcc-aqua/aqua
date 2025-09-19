import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

export default class Endereco extends Model { }

Endereco.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rua: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    numero: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    complemento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cep: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {model: User, key: 'id'}
    }
}, {
    sequelize,
    tableName: 'enderecos',
    timestamps: false
})