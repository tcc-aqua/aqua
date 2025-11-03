import {Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';
import User from './User.js';
import sequelizePaginate from 'sequelize-paginate'

export default class Metas extends Model {}

Metas.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {model: User, key: 'id'}
    },
    residencia_type: {
        type: DataTypes.ENUM('casa', 'apartamento'),
        allowNull: false
    },
    residencia_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    periodo: {
        type: DataTypes.ENUM('7 dias', '14 dias', '30_dias'),
        allowNull: false
    },
    limite_consumo: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('em_andamento', 'atingida', 'excedida'),
        defaultValue: 'em_andamento'
    },
    inicio_periodo: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fim_periodo: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'metas_consumo',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
})

sequelizePaginate.paginate(Metas);