import sequelize from "../config/sequelize.js";
import { DataTypes, Model } from "sequelize";
import sequelizePaginate from 'sequelize-paginate'
import User from "./User.js";
export default class UsersLog extends Model { }

UsersLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        acao: {
            type: DataTypes.ENUM("create", "update", "delete"),
            allowNull: false,
        },
        campo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        valor_antigo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        valor_novo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        alterado_por: {
            type: DataTypes.CHAR(36),
            allowNull: true,
        },
        alterado_em: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "users_logs",
        timestamps: false,
    }
);

sequelizePaginate.paginate(UsersLog);