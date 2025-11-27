import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

export default class ComunicadoLido extends Model {}

ComunicadoLido.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comunicado_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    lido: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: 'comunicados_lidos',
    timestamps: false
});