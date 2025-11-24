import sequelize from "../config/sequelize.js";
import { Model, DataTypes, Sequelize } from "sequelize";
import User from "./User.js";

export default class HistoricoStatusUsuario extends Model {}

HistoricoStatusUsuario.init({
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
    status: {
        type: DataTypes.ENUM("ativo", "inativo"),
        allowNull: false
    },
    data_registro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW   
    }
}, {
    sequelize,
    tableName: 'historico_status_usuarios',
    timestamps: false,
    indexes: [
        {
            fields: ["data_registro"]  
        },
        {
            fields: ["user_id"]
        }
    ]
});
