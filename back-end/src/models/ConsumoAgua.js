import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

export default class ConsumoAgua extends Model {}

ConsumoAgua.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    litros: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {model: User, key: 'id'}
    }
}, {
    sequelize,
    tableName: 'consumo_agua',
    timestamps: false
});