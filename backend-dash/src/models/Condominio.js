import { Model, DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";
import { v4 as uuidv4 } from 'uuid';
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
    codigo: {
        type: DataTypes.CHAR(36),
        defaultValue: () => uuidv4(),
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