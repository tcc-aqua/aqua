import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import Comunicados from "./Comunicados.js";

export default class ComunicadosLidos extends Model {}

ComunicadosLidos.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: { model: User, key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    comunicado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Comunicados, key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    lido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: "comunicados_lidos",
    timestamps: true,
    createdAt: "criado_em",
    updatedAt: "atualizado_em"
});
