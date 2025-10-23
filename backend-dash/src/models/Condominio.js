import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import { nanoid } from 'nanoid';
import sequelizePaginate from 'sequelize-paginate'

export default class Condominio extends Model {}

Condominio.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    endereco: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    codigo_acesso: {
    type: DataTypes.CHAR(10), 
    defaultValue: () => nanoid(10), 
    allowNull: false,
    unique: true
},
    sindico_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {model: User, key: 'id'}
    },
}, {
    sequelize,
    tableName: 'condominios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})

sequelizePaginate.paginate(Condominio);