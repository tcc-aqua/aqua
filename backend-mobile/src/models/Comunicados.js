import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from 'sequelize-paginate';

export default class Comunicados extends Model {}

Comunicados.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    subject: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    addressee: {
        type: DataTypes.ENUM('usuários', 'sindicos', 'todos'),
        defaultValue: 'usuários',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo'
    }
}, {
    sequelize,
    tableName: 'comunicados',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});

sequelizePaginate.paginate(Comunicados);