import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import sequelizePaginate from 'sequelize-paginate'
import Casa from "./Casa.js";

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
        type: DataTypes.ENUM('administradores', 'usuários', 'sindicos'),
        allowNull: false
    },
    condominio_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'condominios',
            key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    casa_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Casa, 
            key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    },
    sindico_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
            model: 'users', // tabela de usuários
            key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
    }
}, {
    sequelize,
    tableName: 'comunicados',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
});

sequelizePaginate.paginate(Comunicados);
