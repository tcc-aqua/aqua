import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import Admin from "./Admin.js";
import sequelizePaginate from 'sequelize-paginate'

export default class Suporte extends  Model {}

Suporte.init({
    id: {
       type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    assunto: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    mensagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    remetente_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    resposta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendente', 'respondido'),
        defaultValue: 'pendente',
    }
}, {
    sequelize,
    tableName: 'suporte',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})

sequelizePaginate.paginate(Suporte);